import { Router } from 'express';
import * as linkController from '../controllers/link.controller';
import { validate } from '../middleware/validate';
import {
  createLinkSchema,
  listLinksQuerySchema,
  updateLinkSchema,
} from '../validators/link.validator';

export const linkRouter = Router();

linkRouter.post('/', validate(createLinkSchema), linkController.create);
linkRouter.get('/', validate(listLinksQuerySchema, 'query'), linkController.list);
linkRouter.get('/:id', linkController.getById);
linkRouter.put('/:id', validate(updateLinkSchema), linkController.update);
linkRouter.delete('/:id', linkController.remove);
