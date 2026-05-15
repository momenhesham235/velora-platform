import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { ApiError, isApiError } from '../handlers';

/**
 * Production-grade TanStack Query defaults.
 *
 * Why we override library defaults:
 *  - Library retries queries up to 3 times and mutations once. A retried
 *    mutation can produce duplicate sign-ups / duplicate writes — we set
 *    mutation retries to 0 and require explicit opt-in per mutation.
 *  - Library refetches on window focus. For a SaaS dashboard this causes
 *    flicker and unnecessary load; Linear/Notion default it off.
 *  - We DO refetch on reconnect — coming back online is a clear resync signal.
 *  - staleTime 30s dedupes the burst of refetches that happens on mount when
 *    many components share a key, without feeling stale.
 *  - gcTime 10 min keeps recently-visited screens warm in memory.
 *
 * Retry filter:
 *  - 4xx means the server already said "no" — retrying makes it worse.
 *  - 408/429 and network/timeout are transient — worth a few attempts.
 *  - 5xx gets one extra retry before giving up.
 */

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 3) return false;

  if (isApiError(error)) {
    if (error.kind === 'network' || error.kind === 'timeout') return true;
    if (error.status === 408 || error.status === 429) return true;
    if (error.kind === 'server') return failureCount < 2;
    return false;
  }
  return failureCount < 1;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 10 * 60_000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: shouldRetry,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      },
      mutations: {
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (error instanceof ApiError && error.kind === 'unauthorized') return;
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('[query]', query.queryKey, error);
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _vars, _ctx, mutation) => {
        if (error instanceof ApiError && error.kind === 'unauthorized') return;
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('[mutation]', mutation.options.mutationKey, error);
        }
      },
    }),
  });
}

/**
 * Module-scoped singleton.
 *
 * Exported so non-React code (logout listeners, devtools, tests) can share
 * the exact same cache as the React provider.
 */
export const queryClient = createQueryClient();
