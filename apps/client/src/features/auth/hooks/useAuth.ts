import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { authKeys } from '@/services/api/query-keys';
import { tokenService } from '@/services/storage';
import type { User } from '@/types/global.types';
import { useCurrentUser } from './useCurrentUser';

/**
 * Read-only composed auth view + a single `login` helper for the
 * useLogin/useRegister flows. Logout lives in `useLogout` (mutation form).
 *
 * State sources:
 *  - Access token + bootstrap flag come from Zustand (client state).
 *  - User object comes from TanStack Query (server state, key authKeys.me()).
 *
 * Why this split: storing the user in BOTH Zustand and the query cache would
 * be two sources of truth that drift apart on refetch. Storing only the token
 * in the query cache would push every read through the React-Query state
 * machine — overkill for a value that mutates on login/refresh/logout only.
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  const { data: user, isPending: isUserPending } = useCurrentUser();

  const isLoading = !bootstrapped || (!!accessToken && isUserPending);
  const isAuthenticated = !!user;

  /**
   * Set the session in one shot. Persists the token, seeds the user-cache so
   * downstream useCurrentUser consumers have data immediately, mirrors the
   * token into Zustand. Consumed by useLogin/useRegister onSuccess.
   */
  const login = useCallback(
    (nextUser: User, token: string) => {
      tokenService.setAccessToken(token);
      queryClient.setQueryData(authKeys.me(), nextUser);
      setAccessToken(token);
    },
    [queryClient, setAccessToken],
  );

  return {
    user: user ?? null,
    isAuthenticated,
    isLoading,
    login,
  };
}
