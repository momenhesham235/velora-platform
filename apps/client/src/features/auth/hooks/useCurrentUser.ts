import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { authKeys } from '@/services/api/query-keys';
import { useAuthStore } from '@/store';

/**
 * Fetches the current user via GET /auth/me.
 *
 * Gated on `accessToken` AND `bootstrapped` so we don't fire on cold start
 * before <AuthSync/> has had a chance to read the token from storage. Once
 * the query lands, `useAuth()` derives `isAuthenticated` from `!!data`.
 *
 * Login/register seed this cache (see useLogin, useRegister) so the first
 * dashboard render after sign-in has the user immediately — no flicker, no
 * extra round-trip.
 */
export function useCurrentUser() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const bootstrapped = useAuthStore((s) => s.bootstrapped);

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authApi.getCurrentUser(),
    enabled: bootstrapped && !!accessToken,
    staleTime: 5 * 60_000,
  });
}
