import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { authEvents } from '@/services/api/auth-events';
import { tokenService } from '@/services/storage';

/**
 * Mutation form of "sign out" — gives callers `isPending`/`error` if they want
 * to render a spinner. For fire-and-forget sign-out (e.g. dropdown menu), use
 * `useAuth().logout` instead.
 *
 * `onSettled`, not `onSuccess`: if the server call fails or the user is
 * offline, we STILL log them out locally. The server's only job here is to
 * invalidate the httpOnly refresh cookie — a useful side-effect, not a
 * precondition. Emitting `session:expired` lets <AuthSync/> own the rest of
 * the side-effects (store reset, queryClient.clear(), navigate) so all logout
 * paths converge on the same handler.
 */
export function useLogout() {
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      tokenService.clearAccessToken();
      authEvents.emit('session:expired', { reason: 'forced-logout' });
    },
  });
}
