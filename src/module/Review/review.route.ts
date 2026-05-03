import express from 'express';
import { ReviewController } from './review.controller';
import auth, { userRole } from '../../middlewares/auth';


const router = express.Router();


//   Student only — review  
router.post('/', auth(userRole.STUDENT), ReviewController.createReview);


export const ReviewRoutes = router;
