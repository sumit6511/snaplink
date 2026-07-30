import { Request, Response } from 'express';
import * as redirectService from '../services/redirect.service';
import { catchAsync } from '../utils/catchAsync';

export const redirectToOriginal = catchAsync(async (req: Request, res: Response) => {
  const link = await redirectService.resolveLink(req.params.shortCode);
  await redirectService.recordClick(link, req);
  res.redirect(302, link.originalUrl);
});
