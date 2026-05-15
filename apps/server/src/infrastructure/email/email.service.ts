import { logger } from '@core/logger';

/**
 * Email Service
 * 
 * Handles email sending functionality
 * Currently a placeholder - integrate with SendGrid, AWS SES, or similar in production
 */

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  /**
   * Send email
   * TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
   */
  static async send(options: EmailOptions): Promise<void> {
    // Placeholder implementation
    logger.info('📧 Email sent (simulated):', {
      to: options.to,
      subject: options.subject,
    });

    // In production, integrate with email service:
    // await sendgrid.send(options);
    // await ses.sendEmail(options);
  }

  /**
   * Send verification email
   */
  static async sendVerificationEmail(
    email: string,
    verificationToken: string
  ): Promise<void> {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    await this.send({
      to: email,
      subject: 'Verify Your Email - Velora',
      html: `
        <h1>Welcome to Velora!</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<void> {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await this.send({
      to: email,
      subject: 'Reset Your Password - Velora',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }

  /**
   * Send welcome email
   */
  static async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.send({
      to: email,
      subject: 'Welcome to Velora!',
      html: `
        <h1>Welcome to Velora, ${name}!</h1>
        <p>We're excited to have you on board.</p>
        <p>Get started by exploring our platform.</p>
      `,
    });
  }
}
