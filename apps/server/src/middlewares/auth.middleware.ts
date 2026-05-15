import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '@utils/jwt.util';
import { User } from '@modules/auth/auth.model';
import { ApiError } from '@core/ApiError';
import { UserRole } from '@shared/enums/user-role.enum';

/**
 * Authentication Middleware
 * 
 * Verifies JWT tokens and attaches user info to request
 * Provides role-based access control (RBAC)
 */

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const payload = JwtUtil.verifyAccessToken(token);

    // Get user from database
    const user = await User.findById(payload.userId);
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    // Attach user to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.unauthorized('Invalid or expired token'));
    }
  }
};

/**
 * Require email verification
 */
export const requireEmailVerification = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }

  if (!req.user.isEmailVerified) {
    return next(ApiError.forbidden('Email verification required'));
  }

  next();
};

/**
 * Role-based access control
 * Checks if user has one of the required roles
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return next(
        ApiError.forbidden('You do not have permission to access this resource')
      );
    }

    next();
  };
};

/**
 * Optional authentication
 * Attaches user if token is valid, but doesn't fail if no token
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const payload = JwtUtil.verifyAccessToken(token);

    const user = await User.findById(payload.userId);
    if (user) {
      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      };
    }

    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};
