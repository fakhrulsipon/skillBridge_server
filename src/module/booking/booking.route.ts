import express from 'express';
import { BookingController } from './booking.controller';
import auth, { userRole } from '../../middlewares/auth';






const router = express.Router();


// Student booking  
router.post('/', auth(userRole.STUDENT), BookingController.createBooking);


// Student & Tutor bookings
router.get('/', auth(userRole.STUDENT, userRole.TUTOR), BookingController.getMyBookings);


// Single booking details
router.get('/:id', auth(userRole.STUDENT, userRole.TUTOR), BookingController.getBookingById);


// Status update — Tutor COMPLETED, Student CANCELLED
router.patch('/:id/status', auth(userRole.STUDENT, userRole.TUTOR), BookingController.updateBookingStatus);


export const BookingRoutes = router;
