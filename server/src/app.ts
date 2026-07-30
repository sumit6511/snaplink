import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { env, isProduction } from './config/env';
import { logger } from './config/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { apiRouter } from './routes';
import { redirectRouter } from './routes/redirect.routes';

export function createApp(): Application {
  const app = express();

  // Required when running behind a reverse proxy (Heroku, Render, Nginx, etc.)
  // so req.ip / req.secure reflect the original client, not the proxy hop.
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());
  app.use(mongoSanitize());
  app.use(hpp());

  if (!isProduction) {
    app.use(morgan('dev', { stream: { write: (msg) => logger.debug(msg.trim()) } }));
  } else {
    app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
  }

  // REST API, versioned under /api so it never collides with short link
  // redirects that live at the root path (e.g. snaplink.io/abc123).
  app.use('/api', apiLimiter, apiRouter);

  // Short link resolution — must stay unauthenticated and outside /api.
  app.use('/', redirectRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
