import crypto from "crypto";
import { User, IUserDocument } from "./auth.model";
import {
  RegisterDTO,
  LoginDTO,
  AuthResponse,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  VerifyEmailDTO,
} from "./auth.types";
import { PasswordUtil } from "@shared/utils/password.util";
import { JwtUtil } from "@shared/utils/jwt.util";
import { EmailService } from "@infrastructure/email/email.service";
import { ApiError } from "@core/ApiError";
import { logger } from "@core/logger";

/**
 * Authentication Service
 *
 * Contains all business logic for authentication operations
 * Separated from controllers for better testability and reusability
 */

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterDTO): Promise<AuthResponse> {
    const { email, password, firstName, lastName } = data;
    // confirmPassword is validated but not stored

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await PasswordUtil.hash(password);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    // Send verification email
    await EmailService.sendVerificationEmail(email, verificationToken);

    // Generate tokens
    const tokens = JwtUtil.generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Save refresh token
    user.refreshTokens = [tokens.refreshToken];
    await user.save();

    logger.info(`New user registered: ${email}`);

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      tokens,
    };
  }

  /**
   * Login user
   */
  static async login(data: LoginDTO): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user with password field
    const user = await User.findOne({ email }).select(
      "+password +refreshTokens",
    );
    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await PasswordUtil.compare(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    // Generate tokens
    const tokens = JwtUtil.generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Save refresh token (keep last 5 tokens)
    user.refreshTokens = [...user.refreshTokens, tokens.refreshToken].slice(-5);
    user.lastLogin = new Date();
    await user.save();

    logger.info(`User logged in: ${email}`);

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      tokens,
    };
  }

  /**
   * Refresh access token
   */
  static async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    // Verify refresh token
    let payload;
    try {
      payload = JwtUtil.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw ApiError.unauthorized("Invalid or expired refresh token");
    }

    // Find user and verify refresh token exists
    const user = await User.findById(payload.userId).select("+refreshTokens");
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw ApiError.unauthorized("Invalid refresh token");
    }

    // Generate new access token
    const accessToken = JwtUtil.generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }

  /**
   * Logout user
   */
  static async logout(userId: string, refreshToken: string): Promise<void> {
    const user = await User.findById(userId).select("+refreshTokens");
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // Remove refresh token
    user.refreshTokens = user.refreshTokens.filter(
      (token) => token !== refreshToken,
    );
    await user.save();

    logger.info(`User logged out: ${user.email}`);
  }

  /**
   * Verify email
   */
  static async verifyEmail(data: VerifyEmailDTO): Promise<void> {
    const { token } = data;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    }).select("+emailVerificationToken +emailVerificationExpires");

    if (!user) {
      throw ApiError.badRequest("Invalid or expired verification token");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email
    await EmailService.sendWelcomeEmail(user.email, user.firstName);

    logger.info(`Email verified: ${user.email}`);
  }

  /**
   * Request password reset
   */
  static async forgotPassword(data: ForgotPasswordDTO): Promise<void> {
    const { email } = data;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists
      logger.warn(`Password reset requested for non-existent email: ${email}`);
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Send reset email
    await EmailService.sendPasswordResetEmail(email, resetToken);

    logger.info(`Password reset requested: ${email}`);
  }

  /**
   * Reset password
   */
  static async resetPassword(data: ResetPasswordDTO): Promise<void> {
    const { token, newPassword } = data;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    }).select(
      "+password +passwordResetToken +passwordResetExpires +refreshTokens",
    );

    if (!user) {
      throw ApiError.badRequest("Invalid or expired reset token");
    }

    // Hash new password
    user.password = await PasswordUtil.hash(newPassword);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Invalidate all refresh tokens for security
    user.refreshTokens = [];

    await user.save();

    logger.info(`Password reset completed: ${user.email}`);
  }

  /**
   * Get user profile
   */
  static async getProfile(userId: string): Promise<IUserDocument> {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return user;
  }
}
