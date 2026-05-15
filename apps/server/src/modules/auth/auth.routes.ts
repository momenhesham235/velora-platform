import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authValidation } from './auth.validation';
import { validate } from '@middlewares/validate.middleware';
import { authenticate } from '@middlewares/auth.middleware';

/**
 * Authentication Routes
 * 
 * Defines all authentication-related endpoints
 */

const router = Router();

/**
 * Public routes (no authentication required)
 */

// POST /api/auth/register - Register new user
router.post(
  '/register',
  validate(authValidation.register),
  AuthController.register
);

// POST /api/auth/login - Login user
router.post(
  '/login',
  validate(authValidation.login),
  AuthController.login
);

// POST /api/auth/refresh - Refresh access token
router.post(
  '/refresh',
  validate(authValidation.refreshToken),
  AuthController.refreshToken
);

// POST /api/auth/verify-email - Verify email address
router.post(
  '/verify-email',
  validate(authValidation.verifyEmail),
  AuthController.verifyEmail
);

// POST /api/auth/forgot-password - Request password reset
router.post(
  '/forgot-password',
  validate(authValidation.forgotPassword),
  AuthController.forgotPassword
);

// POST /api/auth/reset-password - Reset password with token
router.post(
  '/reset-password',
  validate(authValidation.resetPassword),
  AuthController.resetPassword
);

/**
 * Protected routes (authentication required)
 */

// POST /api/auth/logout - Logout user
router.post('/logout', authenticate, AuthController.logout);

// GET /api/auth/me - Get current user profile
router.get('/me', authenticate, AuthController.getProfile);

export default router;
