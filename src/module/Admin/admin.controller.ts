import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

// ─────────────────────────────────────────
// GET /api/v1/admin/users
// ─────────────────────────────────────────
const getAllUsers = async (req: Request, res: Response) => {
   try {
      const result = await AdminService.getAllUsersFromDB();

      sendResponse(res, {
         statusCode: 200,
         success: true,
         message: 'Users fetched successfully',
         data: result,
      });
   } catch (error: any) {
      sendResponse(res, {
         statusCode: 500,
         success: false,
         message: error.message || 'Something went wrong',
         data: null,
      });
   }
};

// ─────────────────────────────────────────
// PATCH /api/v1/admin/users/:id
// ─────────────────────────────────────────
const updateUserStatus = async (req: Request, res: Response) => {
   try {
      const userId = parseInt(req.params.id as string);

      if (isNaN(userId)) {
         return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Invalid user id',
            data: null,
         });
      }

      const result = await AdminService.updateUserStatusIntoDB(userId, req.body);

      sendResponse(res, {
         statusCode: 200,
         success: true,
         message: `User ${req.body.isBanned ? 'banned' : 'unbanned'} successfully`,
         data: result,
      });
   } catch (error: any) {
      sendResponse(res, {
         statusCode: 500,
         success: false,
         message: error.message || 'Something went wrong',
         data: null,
      });
   }
};

// ─────────────────────────────────────────
// GET /api/v1/admin/categories
// ─────────────────────────────────────────
const getAllCategories = async (req: Request, res: Response) => {
   try {
      const result = await AdminService.getAllCategoriesFromDB();

      sendResponse(res, {
         statusCode: 200,
         success: true,
         message: 'Categories fetched successfully',
         data: result,
      });
   } catch (error: any) {
      sendResponse(res, {
         statusCode: 500,
         success: false,
         message: error.message || 'Something went wrong',
         data: null,
      });
   }
};

// ─────────────────────────────────────────
// POST /api/v1/admin/categories
// ─────────────────────────────────────────
const createCategory = async (req: Request, res: Response) => {
   try {
      const result = await AdminService.createCategoryIntoDB(req.body);

      sendResponse(res, {
         statusCode: 201,
         success: true,
         message: 'Category created successfully',
         data: result,
      });
   } catch (error: any) {
      sendResponse(res, {
         statusCode: 500,
         success: false,
         message: error.message || 'Something went wrong',
         data: null,
      });
   }
};

// ─────────────────────────────────────────
// DELETE /api/v1/admin/categories/:id
// ─────────────────────────────────────────
const deleteCategory = async (req: Request, res: Response) => {
   try {
      const categoryId = parseInt(req.params.id as string);

      if (isNaN(categoryId)) {
         return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Invalid category id',
            data: null,
         });
      }

      const result = await AdminService.deleteCategoryFromDB(categoryId);

      sendResponse(res, {
         statusCode: 200,
         success: true,
         message: 'Category deleted successfully',
         data: result,
      });
   } catch (error: any) {
      sendResponse(res, {
         statusCode: 500,
         success: false,
         message: error.message || 'Something went wrong',
         data: null,
      });
   }
};

// ─────────────────────────────────────────
// GET /api/v1/admin/bookings
// ─────────────────────────────────────────
const getAllBookings = async (req: Request, res: Response) => {
   try {
      const result = await AdminService.getAllBookingsFromDB();

      sendResponse(res, {
         statusCode: 200,
         success: true,
         message: 'Bookings fetched successfully',
         data: result,
      });
   } catch (error: any) {
      sendResponse(res, {
         statusCode: 500,
         success: false,
         message: error.message || 'Something went wrong',
         data: null,
      });
   }
};

export const AdminController = {
   getAllUsers,
   updateUserStatus,
   getAllCategories,
   createCategory,
   deleteCategory,
   getAllBookings,
};