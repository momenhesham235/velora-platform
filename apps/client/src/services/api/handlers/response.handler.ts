import type { AxiosResponse } from 'axios';
import type { ApiResponse } from '../types';
import { ApiError } from './api-error';

/**
 * Unwrap the server envelope `{ success, message, data }` and return `data`.
 *
 * - On `success: false` we throw an ApiError so TanStack Query treats the
 *   request as a failure even though the HTTP status was 2xx.
 * - When the server intentionally returns no payload (e.g. logout), we
 *   resolve to `undefined as T`.
 */
export function unwrapResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
  const body = response.data;

  if (!body || typeof body !== 'object' || !('success' in body)) {
    throw new ApiError({
      kind: 'unknown',
      message: 'Malformed server response',
      status: response.status,
      cause: body,
    });
  }

  if (body.success === false) {
    throw new ApiError({
      kind: 'server',
      message: body.error ?? body.message ?? 'Request failed',
      status: response.status,
      cause: body,
    });
  }

  return body.data as T;
}
