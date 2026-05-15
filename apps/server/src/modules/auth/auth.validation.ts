import { z } from 'zod';

/**
 * Authentication Validation Schemas
 * 
 * Zod schemas for validating authentication requests
 */

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export const authValidation = {
  /**
   * Register validation
   */
  register: z.object({
    body: z.object({
      email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format')
        .toLowerCase()
        .trim(),
      password: z
        .string({ required_error: 'Password is required' })
        .min(8, 'Password must be at least 8 characters')
        .regex(
          passwordRegex,
          'Password must contain uppercase, lowercase, number, and special character'
        ),
      confirmPassword: z
        .string({ required_error: 'Please confirm your password' }),
      firstName: z
        .string({ required_error: 'First name is required' })
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name cannot exceed 50 characters')
        .trim(),
      lastName: z
        .string({ required_error: 'Last name is required' })
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name cannot exceed 50 characters')
        .trim(),
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),
  }),

  /**
   * Login validation
   */
  login: z.object({
    body: z.object({
      email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format')
        .toLowerCase()
        .trim(),
      password: z
        .string({ required_error: 'Password is required' })
        .min(1, 'Password is required'),
    }),
  }),

  /**
   * Refresh token validation
   */
  refreshToken: z.object({
    body: z.object({
      refreshToken: z
        .string({ required_error: 'Refresh token is required' })
        .min(1, 'Refresh token is required'),
    }),
  }),

  /**
   * Forgot password validation
   */
  forgotPassword: z.object({
    body: z.object({
      email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format')
        .toLowerCase()
        .trim(),
    }),
  }),

  /**
   * Reset password validation
   */
  resetPassword: z.object({
    body: z.object({
      token: z
        .string({ required_error: 'Reset token is required' })
        .min(1, 'Reset token is required'),
      newPassword: z
        .string({ required_error: 'New password is required' })
        .min(8, 'Password must be at least 8 characters')
        .regex(
          passwordRegex,
          'Password must contain uppercase, lowercase, number, and special character'
        ),
    }),
  }),

  /**
   * Verify email validation
   */
  verifyEmail: z.object({
    body: z.object({
      token: z
        .string({ required_error: 'Verification token is required' })
        .min(1, 'Verification token is required'),
    }),
  }),
};
