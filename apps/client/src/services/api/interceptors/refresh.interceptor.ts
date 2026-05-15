import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { tokenService } from '@/services/storage';
import { authEvents } from '../auth-events';
import type { InternalRequestMeta } from '../types';

/**
 * Refresh-token queue.
 *
 * Why a queue: when N concurrent requests all return 401 (e.g. on app boot
 * with an expired token), we must trigger exactly ONE refresh and replay the
 * other N requests with the new token. Without a queue you get a thundering
 * herd of refresh calls, refresh-token rotation collisions, and false
 * logouts.
 *
 * The first 401 starts the refresh and parks itself. Every subsequent 401
 * during the in-flight refresh enqueues a (resolve, reject) pair. When the
 * refresh settles we flush them.
 *
 * If refresh fails, we clear local state and emit 'auth:unauthorized'. The
 * UI layer owns the redirect — this module never touches window.location.
 */

type QueuedRequest = {
  resolve: (token: string) => void;
  reject: (reason: unknown) => void;
};

let isRefreshing = false;
let pendingQueue: QueuedRequest[] = [];

function flushQueue(error: unknown, token: string | null): void {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error || !token) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

interface RefreshResponseEnvelope {
  success: boolean;
  data?: {
    tokens?: { accessToken?: string };
    accessToken?: string;
  };
}

async function callRefreshEndpoint(client: AxiosInstance): Promise<string> {
  // POST /auth/refresh — refresh token rides in the httpOnly cookie thanks
  // to `withCredentials: true` on the base client. We send an empty body and
  // mark this request so it never re-enters the refresh logic.
  const res = await client.post<RefreshResponseEnvelope>(
    '/auth/refresh',
    {},
    { _isRefreshCall: true, _skipAuth: true },
  );

  const envelope = res.data;
  const newToken =
    envelope?.data?.tokens?.accessToken ?? envelope?.data?.accessToken;

  if (!newToken) {
    throw new Error('Refresh response missing access token');
  }
  return newToken;
}

/**
 * Build a response error interceptor bound to a specific axios instance.
 * The instance is needed twice: once to call /auth/refresh, and once to
 * replay the original failed request.
 */
export function createRefreshInterceptor(client: AxiosInstance) {
  return async function refreshResponseErrorInterceptor(
    error: AxiosError
  ): Promise<unknown> {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & InternalRequestMeta)
      | undefined;

    const status = error.response?.status;

    // Bail out fast for anything that isn't a 401 we should handle.
    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest._isRefreshCall
    ) {
      return Promise.reject(error);
    }

    // A refresh is already in flight — park this request.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            originalRequest.headers.set('Authorization', `Bearer ${token}`);
            originalRequest._retry = true;
            resolve(client(originalRequest));
          },
          reject,
        });
      });
    }

    // First 401 — we own the refresh.
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await callRefreshEndpoint(client);
      tokenService.setAccessToken(newToken);
      authEvents.emit('session:refreshed', { accessToken: newToken });
      flushQueue(null, newToken);

      originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
      return client(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      tokenService.clearAccessToken();
      authEvents.emit('session:expired', { reason: 'refresh-failed' });
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  };
}
