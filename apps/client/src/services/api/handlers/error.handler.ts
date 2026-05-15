import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../types';
import { ApiError, type ApiErrorKind } from './api-error';

/**
 * Normalize anything thrown by axios (or already an ApiError) into an ApiError.
 * Called from the response error interceptor; safe to re-call (idempotent).
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isCancel(error)) {
    return new ApiError({ kind: 'canceled', message: 'Request canceled', cause: error });
  }

  if (axios.isAxiosError(error)) {
    return fromAxiosError(error);
  }

  if (error instanceof Error) {
    return new ApiError({ kind: 'unknown', message: error.message, cause: error });
  }

  return new ApiError({ kind: 'unknown', message: 'Unknown error', cause: error });
}

function fromAxiosError(error: AxiosError<ApiErrorResponse>): ApiError {
  // Timeout
  if (error.code === 'ECONNABORTED') {
    return new ApiError({ kind: 'timeout', message: 'Request timed out', cause: error });
  }

  // No response = network/DNS/offline
  if (!error.response) {
    return new ApiError({
      kind: 'network',
      message: 'Network error. Check your connection and try again.',
      cause: error,
    });
  }

  const { status, data } = error.response;
  const message =
    data?.error ?? data?.message ?? error.message ?? 'Request failed';
  const fieldErrors = normalizeFieldErrors(data?.errors);

  return new ApiError({
    kind: statusToKind(status),
    message,
    status,
    fieldErrors,
    cause: error,
  });
}

function statusToKind(status: number): ApiErrorKind {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 409) return 'conflict';
  if (status === 422 || status === 400) return 'validation';
  if (status >= 500) return 'server';
  return 'unknown';
}

function normalizeFieldErrors(
  raw: ApiErrorResponse['errors']
): Record<string, string[]> | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const out: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(value)) out[key] = value.map(String);
    else if (typeof value === 'string') out[key] = [value];
  }
  return Object.keys(out).length ? out : undefined;
}

/** Convenience for UI code that just wants a string. */
export function extractErrorMessage(
  error: unknown,
  fallback = 'Something went wrong'
): string {
  return toApiError(error).message || fallback;
}
