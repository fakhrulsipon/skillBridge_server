import express from 'express';
import { TutorController } from './tutor.controller';
import auth, { userRole } from '../../middlewares/auth';


const router = express.Router();


router.get('/categories', TutorController.getAllCategories);
router.get('/me', auth(userRole.TUTOR), TutorController.getMyProfile);
router.put('/me', auth(userRole.TUTOR), TutorController.updateTutorProfile);
router.put('/availability', auth(userRole.TUTOR), TutorController.setAvailability);


router.get('/', TutorController.getAllTutors);
router.get('/:id', TutorController.getTutorById);


export const TutorRoutes = router;
