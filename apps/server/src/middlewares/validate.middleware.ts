import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '@core/ApiError';

/**
 * Request Validation Middleware
 * 
 * Validates request body, query, and params against Zod schemas
 * Returns 400 with detailed validation errors if validation fails
 */

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return next(
          ApiError.badRequest(
            `Validation failed: ${errors.map((e) => e.message).join(', ')}`
          )
        );
      }
      next(error);
    }
  };
};
