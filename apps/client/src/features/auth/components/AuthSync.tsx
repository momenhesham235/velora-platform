import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { authEvents } from '@/services/api/auth-events';
import { tokenService } from '@/services/storage';
import { useAuthStore } from '@/store';

/**
 * Single bridge between the framework-free networking layer and React.
 *
 * Responsibilities:
 *  1. Bootstrap: on first mount, pull any persisted access token from storage
 *     into the Zustand store, then flip `bootstrapped` true so gated queries
 *     (useCurrentUser) can fire.
 *  2. Mirror: when the refresh interceptor emits `session:refreshed`, keep the
 *     store's accessToken in sync — components re-render with the new token.
 *  3. Tear down: when `session:expired` fires (refresh failed or user logged
 *     out), clear store state, drop ALL cached server data (next user must
 *     not see the previous user's tasks), and navigate to /login.
 *
 * This component renders nothing. It MUST be mounted inside both QueryProvider
 * (for queryClient access) and BrowserRouter (for useNavigate).
 */
export function AuthSync() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);
  const signOut = useAuthStore((s) => s.signOut);

  // Bootstrap once.
  useEffect(() => {
    const stored = tokenService.getAccessToken();
    if (stored) setAccessToken(stored);
    setBootstrapped();
  }, [setAccessToken, setBootstrapped]);

  // Event subscriptions live for the app's lifetime.
  useEffect(() => {
    const offRefreshed = authEvents.on('session:refreshed', ({ accessToken }) => {
      setAccessToken(accessToken);
    });

    const offExpired = authEvents.on('session:expired', () => {
      signOut();
      queryClient.clear();
      navigate('/login', { replace: true });
    });

    return () => {
      offRefreshed();
      offExpired();
    };
  }, [navigate, queryClient, setAccessToken, signOut]);

  return null;
}
