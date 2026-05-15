/**
 * Shared Authentication Types
 * 
 * These types MUST match between frontend and backend
 */

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MANAGER = 'manager',
}

/**
 * Registration DTO
 * Used for user registration requests
 */
export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Login DTO
 * Used for user login requests
 */
export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * Forgot Password DTO
 */
export interface ForgotPasswordDTO {
  email: string;
}

/**
 * Reset Password DTO
 */
export interface ResetPasswordDTO {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * User Response (returned from API)
 */
export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
}

/**
 * Auth Response (login/register)
 */
export interface AuthResponse {
  user: UserResponse;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

