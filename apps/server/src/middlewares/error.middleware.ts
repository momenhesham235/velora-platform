import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@core/ApiError';
import { logger } from '@core/logger';
import { env } from '@config/env.config';

/**
 * Global Error Handling Middleware
 * 
 * Catches all errors thrown in the application and sends appropriate responses
 * Distinguishes between operational errors (expected) and programmer errors (bugs)
 * Logs errors appropriately based on environment
 */

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;

  // Check if it's our custom ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Log the error
  const errorLog = {
    message: err.message,
    statusCode,
    isOperational,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  };

  if (statusCode >= 500) {
    logger.error('Server Error:', errorLog);
  } else {
    logger.warn('Client Error:', errorLog);
  }

  // Send error response
  const response: any = {
    success: false,
    message,
    statusCode,
  };

  // Include stack trace in development
  if (env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found Handler
 * 
 * Catches requests to undefined routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = ApiError.notFound(`Route ${req.originalUrl} not found`);
  next(error);
};
