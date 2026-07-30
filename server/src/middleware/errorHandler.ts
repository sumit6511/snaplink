import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { ZodError } from 'zod';
import { isProduction } from '../config/env';
import { logger } from '../config/logger';
import { AppError } from '../utils/AppError';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(AppError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

function normalizeError(err: unknown): AppError {
  if (err instanceof AppError) return err;

  if (err instanceof ZodError) {
    return AppError.badRequest(
      'Validation failed',
      err.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
    );
  }

  if (err instanceof MongooseError.ValidationError) {
    const details = Object.values(err.errors).map((e) => e.message);
    return AppError.badRequest('Validation failed', details);
  }

  if (err instanceof MongooseError.CastError) {
    return AppError.badRequest(`Invalid value for field "${err.path}"`);
  }

  if (
    err &&
    typeof err === 'object' &&
    'code' in err &&
    (err as { code?: number }).code === 11000
  ) {
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue ?? {};
    const field = Object.keys(keyValue)[0] ?? 'field';
    return AppError.conflict(`A record with this ${field} already exists`);
  }

  if (err && typeof err === 'object' && 'name' in err) {
    const name = (err as { name?: string }).name;
    if (name === 'JsonWebTokenError') return AppError.unauthorized('Invalid authentication token');
    if (name === 'TokenExpiredError') return AppError.unauthorized('Authentication token expired');
  }

  const message = err instanceof Error ? err.message : 'Something went wrong';
  return new AppError(message, 500);
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const normalized = normalizeError(err);

  if (!normalized.isOperational || normalized.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} -> ${normalized.message}`, {
      stack: err instanceof Error ? err.stack : undefined,
    });
  }

  res.status(normalized.statusCode).json({
    success: false,
    message: normalized.message,
    ...(normalized.details ? { errors: normalized.details } : {}),
    ...(isProduction ? {} : { stack: err instanceof Error ? err.stack : undefined }),
  });
}
