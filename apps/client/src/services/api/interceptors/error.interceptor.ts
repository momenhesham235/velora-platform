import type { AxiosError } from 'axios';
import { toApiError } from '../handlers';

/**
 * Last response interceptor in the chain. Any error that survives the refresh
 * stage gets normalized to ApiError so feature code only ever catches one
 * type. Runs AFTER createRefreshInterceptor — that's important: refresh logic
 * needs to inspect the raw AxiosError before we wrap it.
 */
export function errorResponseInterceptor(error: AxiosError): Promise<never> {
  return Promise.reject(toApiError(error));
}
