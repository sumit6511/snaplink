import { Request, Response } from 'express';
import * as linkService from '../services/link.service';
import { catchAsync } from '../utils/catchAsync';
import { ListLinksQuery } from '../validators/link.validator';

export const create = catchAsync(async (req: Request, res: Response) => {
  const link = await linkService.createLink(req.userId!, req.body);
  res.status(201).json({ success: true, data: { link } });
});

export const list = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as unknown as ListLinksQuery;
  const { items, pagination } = await linkService.listLinks(req.userId!, query);
  res.status(200).json({ success: true, data: { links: items, pagination } });
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const link = await linkService.getOwnedLink(req.userId!, req.params.id);
  res.status(200).json({ success: true, data: { link } });
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const link = await linkService.updateLink(req.userId!, req.params.id, req.body);
  res.status(200).json({ success: true, data: { link } });
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  await linkService.deleteLink(req.userId!, req.params.id);
  res.status(204).send();
});
