import { Router } from 'express';
import mongoose from 'mongoose';

export const healthRouter = Router();

// mongoose.connection.readyState: 0 = disconnected, 1 = connected,
// 2 = connecting, 3 = disconnecting. Only 1 means the app can actually serve
// requests that touch the DB — reporting healthy regardless (the old
// behavior) makes this useless as a container/orchestrator readiness probe.
healthRouter.get('/', (_req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;

  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    message: dbConnected ? 'SnapLink API is healthy' : 'Database is not connected',
    db: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});
