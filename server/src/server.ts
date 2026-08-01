import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { logger } from './config/logger';
import { startScheduledJobs } from './jobs/scheduler';

async function bootstrap(): Promise<void> {
  await connectDB();
  startScheduledJobs();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info(`SnapLink API listening on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
    throw reason;
  });

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
    process.exit(1);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start SnapLink API:', err);
  process.exit(1);
});
