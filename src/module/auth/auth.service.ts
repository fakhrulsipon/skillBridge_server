import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";


const createUser = async (payload: any) => {
  const { name, email, password, role } = payload;

  if (!name || !email || !password || !role) {
    throw new Error("All fields are required");
  }

  if (!["STUDENT","TUTOR"].includes(role)) {
    throw new Error("Role must be STUDENT or TUTOR");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await prisma.user.create({
    data: {
      name,
      email,
      role,
      password: hashPassword,
    },
  });

  const { password: _, ...userWithoutPassword } = result;

  return userWithoutPassword;
};

const loginUser = async (payload: any) => {
  const { email, password } = payload;
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("No user found with this email");
  }
  if (user.isBanned) {
    throw new Error("your account is banned, please contact support");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const token = jwt.sign(userData, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "7d",
  });
  return { token , user:userData};
};

const getMe = async (payload: any) => {
  const userId = payload?.id;

  if (!userId) {
    throw new Error("Unauthorized: user id not found in token");
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};



const AuthServices = {
  createUser,
  loginUser,
  getMe,
};

export default AuthServices;
