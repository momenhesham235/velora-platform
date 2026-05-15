import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@core/ApiError';
import { logger } from '@core/logger';
import { env } from '@config/env.config';
import { ErrorCode } from '@velora/types';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;
  let code: ErrorCode | undefined = ErrorCode.INTERNAL_ERROR;
  let details: ApiError['details'];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
    code = err.code;
    details = err.details;
  }

  const errorLog = {
    message: err.message,
    statusCode,
    code,
    isOperational,
    requestId: req.requestId,
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

  const response: Record<string, unknown> = {
    success: false,
    message,
    statusCode,
    code,
    requestId: req.requestId,
  };

  if (details?.length) {
    response.details = details;
  }

  if (env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = ApiError.notFound(`Route ${req.originalUrl} not found`);
  next(error);
};
