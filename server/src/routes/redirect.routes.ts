import { Router } from 'express';
import { redirectToOriginal } from '../controllers/redirect.controller';
import { redirectLimiter } from '../middleware/rateLimiter';

export const redirectRouter = Router();

redirectRouter.get('/:shortCode', redirectLimiter, redirectToOriginal);
