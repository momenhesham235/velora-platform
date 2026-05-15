import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuth } from './useAuth';
import { LoginCredentials } from '../types';

/**
 * Login mutation.
 *
 * `login(user, token)` does everything: persists token via tokenService,
 * seeds the authKeys.me() cache with the user, mirrors the token into Zustand.
 * Refresh token already landed in the httpOnly cookie server-side.
 */
export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      login(data.user, data.tokens.accessToken);
      navigate('/dashboard');
    },
  });
}
