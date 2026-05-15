import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';
import { queryClient } from '@/services/api/query-client';

/**
 * Mounts the shared QueryClient with DevTools in development.
 *
 * The instance lives in `services/api/query-client` so non-React code can
 * import the same cache (e.g. a logout listener calling `queryClient.clear()`).
 *
 * DevTools are automatically tree-shaken in production builds and only appear
 * in development mode. They provide:
 *  - Real-time query cache inspection
 *  - Query invalidation controls
 *  - Mutation tracking
 *  - Network request timeline
 */
interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}
