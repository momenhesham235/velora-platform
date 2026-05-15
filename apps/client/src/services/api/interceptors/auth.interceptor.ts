import type { InternalAxiosRequestConfig } from 'axios';
import { tokenService } from '@/services/storage';
import type { InternalRequestMeta } from '../types';

/**
 * Attach the Bearer access token to every outgoing request.
 *
 * Reads through the tokenService abstraction — no Zustand, no React. Requests
 * may opt out with `config._skipAuth = true` (used by login/register/refresh).
 */
export function authRequestInterceptor(
  config: InternalAxiosRequestConfig & InternalRequestMeta
): InternalAxiosRequestConfig {
  if (config._skipAuth) return config;

  const token = tokenService.getAccessToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
}
