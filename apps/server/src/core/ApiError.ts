import { ErrorCode, FieldError } from '@velora/types';

/**
 * Custom API Error Class
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: ErrorCode;
  public readonly details?: FieldError[];

  constructor(
    statusCode: number,
    message: string,
    options?: {
      isOperational?: boolean;
      code?: ErrorCode;
      details?: FieldError[];
      stack?: string;
    }
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = options?.isOperational ?? true;
    this.code = options?.code;
    this.details = options?.details;

    if (options?.stack) {
      this.stack = options.stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(
    message: string,
    details?: FieldError[],
    code: ErrorCode = ErrorCode.VALIDATION_ERROR
  ): ApiError {
    return new ApiError(400, message, { code, details });
  }

  static unauthorized(message: string = 'Unauthorized'): ApiError {
    return new ApiError(401, message, { code: ErrorCode.UNAUTHORIZED });
  }

  static forbidden(message: string = 'Forbidden'): ApiError {
    return new ApiError(403, message, { code: ErrorCode.FORBIDDEN });
  }

  static notFound(message: string = 'Resource not found'): ApiError {
    return new ApiError(404, message, { code: ErrorCode.NOT_FOUND });
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, message, { code: ErrorCode.CONFLICT });
  }

  static internal(message: string = 'Internal server error'): ApiError {
    return new ApiError(500, message, {
      isOperational: false,
      code: ErrorCode.INTERNAL_ERROR,
    });
  }

  static validation(details: FieldError[]): ApiError {
    return new ApiError(400, 'Validation failed', {
      code: ErrorCode.VALIDATION_ERROR,
      details,
    });
  }
}
