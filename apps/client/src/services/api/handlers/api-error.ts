/**
 * Single error type the rest of the app catches against.
 *
 * Whether a failure originated as a server envelope (`success: false`), an
 * axios network error, a timeout, or a client-side abort, the error
 * interceptor wraps it in ApiError so feature code only needs one shape.
 */

export type ApiErrorKind =
  | 'network'
  | 'timeout'
  | 'canceled'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation'
  | 'conflict'
  | 'server'
  | 'unknown';

interface ApiErrorOptions {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  /** Field-level validation details if the server supplied them. */
  fieldErrors?: Record<string, string[]>;
  /** Raw payload, kept for debugging. Don't read this in feature code. */
  cause?: unknown;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly fieldErrors?: Record<string, string[]>;
  readonly cause?: unknown;

  constructor(options: ApiErrorOptions) {
    super(options.message);
    this.name = 'ApiError';
    this.kind = options.kind;
    this.status = options.status;
    this.fieldErrors = options.fieldErrors;
    this.cause = options.cause;
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}
