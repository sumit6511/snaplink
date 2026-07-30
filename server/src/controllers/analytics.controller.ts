import { Request, Response } from 'express';
import * as analyticsService from '../services/analytics.service';
import { catchAsync } from '../utils/catchAsync';

export const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const data = await analyticsService.getLinkAnalytics(req.userId!, req.params.id);
  res.status(200).json({ success: true, data });
});
