import type { AxiosInstance } from 'axios';
import { authRequestInterceptor } from './auth.interceptor';
import { workspaceInterceptor } from './workspace.interceptor';
import { createRefreshInterceptor } from './refresh.interceptor';
import { errorResponseInterceptor } from './error.interceptor';

/**
 * Wire all interceptors onto a given axios instance.
 *
 * Order matters on the response side:
 *   1. refresh interceptor sees raw AxiosError, may retry transparently
 *   2. error interceptor wraps whatever survives into ApiError
 *
 * Axios chains response interceptors in REGISTRATION order for success and
 * REVERSE order for errors — registering refresh first, then error means the
 * error normalizer wraps last, which is what we want.
 */
export function attachInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use(authRequestInterceptor);
  client.interceptors.request.use(workspaceInterceptor);

  client.interceptors.response.use(
    (response) => response,
    createRefreshInterceptor(client)
  );

  client.interceptors.response.use(
    (response) => response,
    errorResponseInterceptor
  );
}
