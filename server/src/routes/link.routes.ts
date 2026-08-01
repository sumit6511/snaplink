import { Router } from 'express';
import * as linkController from '../controllers/link.controller';
import { bulkImportLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import {
  bulkImportSchema,
  createLinkSchema,
  exportLinksQuerySchema,
  listLinksQuerySchema,
  updateLinkSchema,
} from '../validators/link.validator';

export const linkRouter = Router();

linkRouter.post('/', validate(createLinkSchema), linkController.create);
linkRouter.post(
  '/bulk-import',
  bulkImportLimiter,
  validate(bulkImportSchema),
  linkController.bulkImport,
);
linkRouter.get('/', validate(listLinksQuerySchema, 'query'), linkController.list);
linkRouter.get('/stats/summary', linkController.stats);
// Must come before /:id, or Express would match "export" as an :id param.
linkRouter.get('/export', validate(exportLinksQuerySchema, 'query'), linkController.exportCsv);
linkRouter.get('/:id', linkController.getById);
linkRouter.put('/:id', validate(updateLinkSchema), linkController.update);
linkRouter.delete('/:id', linkController.remove);
