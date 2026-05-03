import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import AuthServices from "./auth.service";



const createUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthServices.createUser(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created Successfully",
      data: result,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: err.message || "something went wrong",
      data: null,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthServices.loginUser(req.body);
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"User logged in Successfully",
        data:result
    })
  } catch (error) {
    sendResponse(res,{
        statusCode:500,
        success:false,
        message: (error instanceof Error ? error.message : "something went wrong"),
        data:null
    })
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    const result = await AuthServices.getMe(req.user);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Profile fetched successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error instanceof Error ? error.message : "something went wrong",
      data: null,
    });
  }
};

const AuthController = {
  createUser,
  loginUser,
  getMe
};

export default AuthController;
