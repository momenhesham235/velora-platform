import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuth } from './useAuth';
import { RegisterData } from '../types';

/**
 * Register mutation.
 *
 * Same shape as useLogin: `login(user, token)` persists, seeds cache, mirrors
 * to Zustand. If the backend marks `isEmailVerified: false`, the dashboard
 * surfaces the verification prompt — we don't gate routing on it here.
 */
export function useRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (data) => {
      login(data.user, data.tokens.accessToken);
      navigate('/dashboard');
    },
  });
}
