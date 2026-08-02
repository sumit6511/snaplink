import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authLimiter, emailLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../validators/auth.validator';

export const authRouter = Router();

authRouter.post('/register', authLimiter, validate(registerSchema), authController.register);
authRouter.post('/login', authLimiter, validate(loginSchema), authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);
authRouter.post(
  '/forgot-password',
  emailLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
authRouter.post(
  '/reset-password',
  authLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword,
);
authRouter.post(
  '/verify-email',
  authLimiter,
  validate(verifyEmailSchema),
  authController.verifyEmail,
);
