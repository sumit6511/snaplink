import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.getUserProfile(req.userId!);
  res.status(200).json({ success: true, data: { user } });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.updateUserProfile(req.userId!, req.body);
  res.status(200).json({ success: true, data: { user } });
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  await authService.changeUserPassword(req.userId!, req.body);
  res.status(200).json({ success: true, message: 'Password changed successfully' });
});
