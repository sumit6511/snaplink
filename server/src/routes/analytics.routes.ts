import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';

export const analyticsRouter = Router();

analyticsRouter.get('/:id', analyticsController.getAnalytics);
analyticsRouter.get('/:id/export', analyticsController.exportClickHistoryCsv);
