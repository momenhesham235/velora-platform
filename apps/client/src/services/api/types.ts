/**
 * Wire-level shapes the server emits.
 *
 * Backend envelope (apps/server/src/core/response.ts):
 *   { success: boolean, message: string, data?: T, error?: string }
 *
 * We model success and error as a discriminated union so TS narrows correctly
 * after a `success` check.
 */

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  /** Optional Zod / validation issues bag (server may attach this). */
  errors?: Record<string, string[]> | unknown;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/** Extends Axios's config with our internal retry flag without using `any`. */
export interface InternalRequestMeta {
  _retry?: boolean;
  /** Set on the refresh request itself so the interceptor never recurses. */
  _isRefreshCall?: boolean;
  /** Opt out of automatic auth header injection (e.g. login/register). */
  _skipAuth?: boolean;
}

/**
 * Module augmentation: every axios call site (axiosClient.post, http.get, ...)
 * accepts our private flags in the config arg with full type-safety. Without
 * this, callers would need `as unknown as AxiosRequestConfig` casts.
 */
declare module 'axios' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface AxiosRequestConfig extends InternalRequestMeta {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface InternalAxiosRequestConfig extends InternalRequestMeta {}
}
