import axios from 'axios';
import { apiConfig } from '../config';
import { attachInterceptors } from '../interceptors';

/**
 * Centralized axios instance.
 *
 * - withCredentials: true so the httpOnly refresh cookie flows on every call,
 *   including /auth/refresh.
 * - timeoutMs guards against hung sockets — important on shaky networks.
 * - All interceptors are wired in one place so behavior is deterministic and
 *   feature code never reaches for `axios.defaults`.
 *
 * NOTE: do not import this from components directly. Use the `http` wrapper
 * (./http) or feature-scoped API modules under features/<name>/api/.
 */
export const axiosClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeoutMs,
  withCredentials: apiConfig.withCredentials,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

attachInterceptors(axiosClient);
