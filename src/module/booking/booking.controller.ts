import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { BookingService } from "./booking.service";


// ─────────────────────────────────────────
// POST /api/v1/booking
// ─────────────────────────────────────────
const createBooking = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.id;
      const result = await BookingService.createBookingIntoDB(userId, req.body);


      sendResponse(res, {
         statusCode: 201,
         success: true,
         message: 'Booking created successfully',
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
// GET /api/v1/booking
// ─────────────────────────────────────────
const getMyBookings = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.id;
      const role = req.user?.role;


      const result = await BookingService.getMyBookingsFromDB(userId, role);


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


// ─────────────────────────────────────────
// GET /api/v1/booking/:id
// ─────────────────────────────────────────
const getBookingById = async (req: Request, res: Response) => {
   try {
      const bookingId = parseInt(req.params.id as string);
      const userId = req.user?.id;
      const role = req.user?.role;


      if (isNaN(bookingId)) {
         return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Invalid booking id',
            data: null,
         });
      }


      const result = await BookingService.getBookingByIdFromDB(bookingId, userId, role);


      sendResponse(res, {
         statusCode: 200,
         success: true,
         message: 'Booking fetched successfully',
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
// PATCH /api/v1/booking/:id/status
// ─────────────────────────────────────────
const updateBookingStatus = async (req: Request, res: Response) => {
   try {
      const bookingId = parseInt(req.params.id as string);
      const userId = req.user?.id;
      const role = req.user?.role;
      const { status } = req.body;


      const result = await BookingService.updateBookingStatusIntoDB(
         bookingId,
         userId,
         role,
         status
      );


      sendResponse(res, {
         statusCode: 200,
         success: true,
         message: `Booking ${status.toLowerCase()} successfully`,
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








export const BookingController = {
   createBooking,
   getMyBookings,
   getBookingById,
   updateBookingStatus,
};
