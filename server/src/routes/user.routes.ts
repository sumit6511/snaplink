import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import { changePasswordSchema, updateProfileSchema } from '../validators/user.validator';

export const userRouter = Router();

userRouter.get('/profile', protect, userController.getProfile);
userRouter.put('/profile', protect, validate(updateProfileSchema), userController.updateProfile);
userRouter.put(
  '/password',
  protect,
  authLimiter,
  validate(changePasswordSchema),
  userController.changePassword,
);
