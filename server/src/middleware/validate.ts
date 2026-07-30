import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

type RequestPart = 'body' | 'query' | 'params';

/**
 * Validates and replaces req[part] with the parsed (and coerced) data from
 * the given Zod schema. Throws via next() so errorHandler's ZodError branch
 * produces a consistent 400 response.
 */
export function validate(schema: ZodType, part: RequestPart = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      next(result.error);
      return;
    }
    req[part] = result.data;
    next();
  };
}
