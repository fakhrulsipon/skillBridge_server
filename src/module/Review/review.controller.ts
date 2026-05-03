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





export const ReviewController = {
   createReview
};
