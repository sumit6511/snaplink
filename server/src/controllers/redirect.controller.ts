import { Request, Response } from 'express';
import * as redirectService from '../services/redirect.service';
import { catchAsync } from '../utils/catchAsync';

export const redirectToOriginal = catchAsync(async (req: Request, res: Response) => {
  const link = await redirectService.resolveLink(req.params.shortCode);
  // Redirect immediately; click tracking (geoip lookup + DB write) happens
  // after the response so it never adds latency to the app's hottest path.
  // recordClick already catches and logs its own errors internally.
  res.redirect(302, link.originalUrl);
  void redirectService.recordClick(link, req);
});
