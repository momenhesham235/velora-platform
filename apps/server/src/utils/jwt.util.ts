import jwt from 'jsonwebtoken';
import { env } from '@config/env.config';

/**
 * JWT Utility
 * 
 * Handles JWT token generation and verification
 * Supports both access tokens (short-lived) and refresh tokens (long-lived)
 */

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class JwtUtil {
  // Access token expires in 15 minutes
  private static readonly ACCESS_TOKEN_EXPIRY = '15m';
  // Refresh token expires in 7 days
  private static readonly REFRESH_TOKEN_EXPIRY = '7d';

  /**
   * Generate access token
   */
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    });
  }

  /**
   * Generate both access and refresh tokens
   */
  static generateTokens(payload: TokenPayload): TokenResponse {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  static decode(token: string): any {
    return jwt.decode(token);
  }
}
