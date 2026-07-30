import { Router } from 'express';
import { AppError } from '../utils/AppError';

export const redirectRouter = Router();

// Placeholder until the Link model and redirect service are implemented.
// Reserves the root-level route so short codes (e.g. /abc123) never fall
// through to the API's 404 handler with a confusing message.
redirectRouter.get('/:shortCode', (req, _res, next) => {
  next(AppError.notFound(`No link found for code "${req.params.shortCode}"`));
});
