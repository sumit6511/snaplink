import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middleware/auth';

export const userRouter = Router();

userRouter.get('/profile', protect, userController.getProfile);
