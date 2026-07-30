import { Router } from 'express';
import { healthRouter } from './health.routes';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);

// Additional routers (auth, user, links, analytics) are mounted here as
// each feature is implemented.
