import express from 'express';
import { TutorController } from './tutor.controller';
import auth, { userRole } from '../../middlewares/auth';


const router = express.Router();


router.get('/categories', TutorController.getAllCategories);
router.get('/me', auth(userRole.TUTOR), TutorController.getMyProfile);


export const TutorRoutes = router;
