import { Request, Response } from 'express';
import * as analyticsService from '../services/analytics.service';
import { catchAsync } from '../utils/catchAsync';

export const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const data = await analyticsService.getLinkAnalytics(req.userId!, req.params.id);
  res.status(200).json({ success: true, data });
});

export const exportClickHistoryCsv = catchAsync(async (req: Request, res: Response) => {
  const csv = await analyticsService.exportClickHistoryCsv(req.userId!, req.params.id);
  const date = new Date().toISOString().slice(0, 10);

  res
    .status(200)
    .header('Content-Type', 'text/csv; charset=utf-8')
    .header('Content-Disposition', `attachment; filename="snaplink-analytics-${date}.csv"`)
    .send(csv);
});
