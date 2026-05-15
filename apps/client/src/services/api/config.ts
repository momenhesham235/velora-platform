/**
 * API client configuration.
 *
 * baseURL defaults to '/api' (relative) so dev hits the Vite proxy and
 * production can run same-origin without CORS. Override via VITE_API_BASE_URL
 * when client and server live on different domains.
 */
export const apiConfig = {
  baseURL: (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api',
  timeoutMs: 20_000,
  withCredentials: true,
} as const;

export type ApiConfig = typeof apiConfig;
