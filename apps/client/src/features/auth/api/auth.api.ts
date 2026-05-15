import { http } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import type { User } from '@/types/global.types';
import type {
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  AuthResponse,
} from '../types';

/**
 * Auth feature API.
 *
 * Each call returns the unwrapped `data` payload, or throws ApiError.
 *
 * Endpoints that establish a session (login/register/forgot-password) pass
 * `_skipAuth: true` so the auth interceptor doesn't attach a stale Bearer
 * header from a previous session. The refresh cookie is set by the server.
 */
export const authApi = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    http.post<AuthResponse, LoginCredentials>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
      { _skipAuth: true }
    ),

  register: (data: RegisterData): Promise<AuthResponse> =>
    http.post<AuthResponse, RegisterData>(
      API_ENDPOINTS.AUTH.REGISTER,
      data,
      { _skipAuth: true }
    ),

  logout: (): Promise<void> => http.post<void>(API_ENDPOINTS.AUTH.LOGOUT),

  forgotPassword: (data: ForgotPasswordData): Promise<void> =>
    http.post<void, ForgotPasswordData>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data,
      { _skipAuth: true }
    ),

  getCurrentUser: (): Promise<User> => http.get<User>(API_ENDPOINTS.AUTH.ME),
};
