import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { TutorService } from "./tutor.service";


// ─────────────────────────────────────────
// Create Tutor Profile
// ─────────────────────────────────────────
const createTutor = async (req: Request, res: Response) => {
   try {
      console.log('controller', req?.user);
      const result = await TutorService.createTutorIntoDB(req.body, req.user?.id);
      sendResponse(res, {
         statusCode: 201,
         success: true,
         message: 'Tutor profile created successfully',
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
// Get My Profile
// ─────────────────────────────────────────
const getMyProfile = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.id;
      const result = await TutorService.getMyProfileFromDB(userId);


      sendResponse(res, {
         statusCode: 200,
         success: true,
         message: 'Profile fetched successfully',
         data: result,
      });
   } catch (error: any) {
      sendResponse(res, {
         statusCode: 404,
         success: false,
         message: error.message || 'Something went wrong',
         data: null,
      });
   }
};

// ─────────────────────────────────────────
// Update Tutor Profile
// ─────────────────────────────────────────
const updateTutorProfile = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.id;
      const result = await TutorService.updateTutorProfileIntoDB(userId, req.body);


      sendResponse(res, {
         statusCode: 200,
         success: true,
         message: 'Profile updated successfully',
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
// Set Availability
// ─────────────────────────────────────────
const setAvailability = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.id;
      const { slots } = req.body;


      const result = await TutorService.setAvailabilityIntoDB(userId, slots);


      sendResponse(res, {
         statusCode: 200,
         success: true,
         message: 'Availability set successfully',
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

// / ─────────────────────────────────────────
// Get Tutor By ID (Public)
// ─────────────────────────────────────────
const getTutorById = async (req: Request, res: Response) => {
   try {
      const id = parseInt(req.params.id as string);


      const result = await TutorService.getTutorByIdFromDB(id);


      sendResponse(res, {
         statusCode: 200,
         success: true,
         message: 'Tutor fetched successfully',
         data: result,
      });
   } catch (error: any) {
      sendResponse(res, {
         statusCode: 404,
         success: false,
         message: error.message || 'Something went wrong',
         data: null,
      });
   }
};

export const TutorController = {
   createTutor,
   getMyProfile,
   updateTutorProfile,
   setAvailability,
   getTutorById
};
