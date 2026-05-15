import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ApiError } from '@core/ApiError';
import { ResponseUtil } from '@core/response';
import { asyncHandler } from '@middlewares/asyncHandler';
import {
  RegisterDTO,
  LoginDTO,
  RefreshTokenDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  VerifyEmailDTO,
} from './auth.types';

/**
 * Authentication Controller
 * 
 * Handles HTTP requests for authentication endpoints
 * Delegates business logic to AuthService
 */

export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data: RegisterDTO = req.body;
      const result = await AuthService.register(data);

      return ResponseUtil.created(
        res,
        'User registered successfully. Please verify your email.',
        result
      );
    }
  );

  /**
   * Login user
   * POST /api/auth/login
   */
  static login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data: LoginDTO = req.body;
      const result = await AuthService.login(data);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return ResponseUtil.success(res, 'Login successful', result);
    }
  );

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  static refreshToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // Get refresh token from cookie or body
      const refreshToken =
        req.cookies.refreshToken || req.body?.refreshToken;

      if (!refreshToken) {
        throw ApiError.unauthorized('Refresh token is required');
      }

      const result = await AuthService.refreshToken(refreshToken);

      return ResponseUtil.success(
        res,
        'Token refreshed successfully',
        result
      );
    }
  );

  /**
   * Logout user
   * POST /api/auth/logout
   */
  static logout = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user!.id;
      const refreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

      await AuthService.logout(userId, refreshToken);

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      return ResponseUtil.success(res, 'Logout successful');
    }
  );

  /**
   * Verify email
   * POST /api/auth/verify-email
   */
  static verifyEmail = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data: VerifyEmailDTO = req.body;
      await AuthService.verifyEmail(data);

      return ResponseUtil.success(res, 'Email verified successfully');
    }
  );

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  static forgotPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data: ForgotPasswordDTO = req.body;
      await AuthService.forgotPassword(data);

      return ResponseUtil.success(
        res,
        'If the email exists, a password reset link has been sent'
      );
    }
  );

  /**
   * Reset password
   * POST /api/auth/reset-password
   */
  static resetPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data: ResetPasswordDTO = req.body;
      await AuthService.resetPassword(data);

      return ResponseUtil.success(res, 'Password reset successfully');
    }
  );

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  static getProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user!.id;
      const user = await AuthService.getProfile(userId);

      return ResponseUtil.success(res, 'Profile retrieved successfully', user);
    }
  );
}
