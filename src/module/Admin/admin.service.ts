import { prisma } from "../../lib/prisma";

// ─────────────────────────────────────────
// Get All Users
// ─────────────────────────────────────────
const getAllUsersFromDB = async () => {

   const users = await prisma.user.findMany({
      select: {
         id: true,
         name: true,
         email: true,
         role: true,
         isBanned: true,
         createdAt: true,
         tutorProfile: {
            select: {
               id: true,
               hourlyRate: true,
               avgRating: true,
               totalReviews: true,
               isApproved: true,
            }
         }
      },
      orderBy: { createdAt: "desc" }
   });

   return users;
};

// ─────────────────────────────────────────
// Update User Status (ban/unban)
// ─────────────────────────────────────────
const updateUserStatusIntoDB = async (userId: number, payload: any) => {

   // Check user exists
   const user = await prisma.user.findUnique({
      where: { id: userId }
   });

   if (!user) {
      throw new Error('User not found');
   }

   // Cannot ban another admin
   if (user.role === 'ADMIN') {
      throw new Error('Cannot update admin user status');
   }

   const updated = await prisma.user.update({
      where: { id: userId },
      data: {
         isBanned: payload.isBanned,
      },
      select: {
         id: true,
         name: true,
         email: true,
         role: true,
         isBanned: true,
      }
   });

   return updated;
};

// ─────────────────────────────────────────
// Get All Categories
// ─────────────────────────────────────────
const getAllCategoriesFromDB = async () => {

   const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
         _count: {
            select: { tutors: true } // কতজন tutor আছে
         }
      }
   });

   return categories;
};

// ─────────────────────────────────────────
// Create Category
// ─────────────────────────────────────────
const createCategoryIntoDB = async (payload: any) => {

   if (!payload.name) {
      throw new Error('Category name is required');
   }

   // Check already exists
   const existing = await prisma.category.findUnique({
      where: { name: payload.name }
   });

   if (existing) {
      throw new Error('Category already exists');
   }

   const category = await prisma.category.create({
      data: {
         name: payload.name,
         icon: payload.icon || null,
      }
   });

   return category;
};

// ─────────────────────────────────────────
// Delete Category
// ─────────────────────────────────────────
const deleteCategoryFromDB = async (categoryId: number) => {

   const category = await prisma.category.findUnique({
      where: { id: categoryId }
   });

   if (!category) {
      throw new Error('Category not found');
   }

   await prisma.category.delete({
      where: { id: categoryId }
   });

   return { message: 'Category deleted successfully' };
};

// ─────────────────────────────────────────
// Get All Bookings
// ─────────────────────────────────────────
const getAllBookingsFromDB = async () => {

   const bookings = await prisma.booking.findMany({
      include: {
         student: {
            select: {
               id: true,
               name: true,
               email: true,
            }
         },
         tutorProfile: {
            include: {
               user: {
                  select: {
                     id: true,
                     name: true,
                     email: true,
                  }
               }
            }
         }
      },
      orderBy: { createdAt: "desc" }
   });

   return bookings;
};

export const AdminService = {
   getAllUsersFromDB,
   updateUserStatusIntoDB,
   getAllCategoriesFromDB,
   createCategoryIntoDB,
   deleteCategoryFromDB,
   getAllBookingsFromDB,
};