import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router();

router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);

export default router;