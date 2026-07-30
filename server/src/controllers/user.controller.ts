import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.getUserProfile(req.userId!);
  res.status(200).json({ success: true, data: { user } });
});
