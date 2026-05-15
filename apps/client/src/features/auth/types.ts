/**
 * Authentication Types
 * 
 * IMPORTANT: These types MUST match the backend DTOs
 * Backend uses: firstName, lastName (NOT "name")
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

import type { User } from '@/types/global.types';

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * Helper to get full name from user
 */
export const getFullName = (user: { firstName: string; lastName: string }): string => {
  return `${user.firstName} ${user.lastName}`;
}
