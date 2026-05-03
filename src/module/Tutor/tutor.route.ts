import express from 'express';
import { TutorController } from './tutor.controller';
import auth, { userRole } from '../../middlewares/auth';


const router = express.Router();


router.get('/categories', TutorController.getAllCategories);


export const TutorRoutes = router;
