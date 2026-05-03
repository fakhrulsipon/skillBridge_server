import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";


// ─────────────────────────────────────────
// POST /api/v1/review
// ─────────────────────────────────────────
const createReview = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.id;
      const result = await ReviewService.createReviewIntoDB(userId, req.body);


      sendResponse(res, {
         statusCode: 201,
         success: true,
         message: 'Review submitted successfully',
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

// GET /api/v1/review/tutor/:tutorProfileId
// ─────────────────────────────────────────
const getTutorReviews = async (req: Request, res: Response) => {
   try {
      const tutorProfileId = parseInt(req.params.tutorProfileId as string);


      if (isNaN(tutorProfileId)) {
         return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Invalid tutor profile id',
            data: null,
         });
      }


      const result = await ReviewService.getTutorReviewsFromDB(tutorProfileId);


      sendResponse(res, {
         statusCode: 200,
         success: true,
         message: 'Reviews fetched successfully',
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

export const ReviewController = {
   createReview,
   getTutorReviews
};
