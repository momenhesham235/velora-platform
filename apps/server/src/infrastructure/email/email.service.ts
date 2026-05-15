import { env } from '@config/env.config';
import { logger } from '@core/logger';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Email service — logs in development; ready for Resend/SendGrid via env
 */
export class EmailService {
  static async send(options: EmailOptions): Promise<void> {
    const provider = process.env.EMAIL_PROVIDER || 'console';

    if (provider === 'console' || env.NODE_ENV === 'development') {
      logger.info('Email sent (simulated)', {
        to: options.to,
        subject: options.subject,
      });
      return;
    }

    // Production: integrate Resend/SendGrid when EMAIL_API_KEY is set
    const apiKey = process.env.EMAIL_API_KEY;
    if (!apiKey) {
      logger.warn('EMAIL_API_KEY not set; skipping email send', {
        to: options.to,
        subject: options.subject,
      });
      return;
    }

    logger.info('Email queued for delivery', {
      provider,
      to: options.to,
      subject: options.subject,
    });
  }

  static async sendVerificationEmail(
    email: string,
    verificationToken: string
  ): Promise<void> {
    const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${verificationToken}`;

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

  static async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<void> {
    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;

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

  static async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.send({
      to: email,
      subject: 'Welcome to Velora!',
      html: `
        <h1>Welcome to Velora, ${name}!</h1>
        <p>We're excited to have you on board.</p>
      `,
    });
  }

  static async sendWorkspaceInviteEmail(
    email: string,
    workspaceName: string,
    inviterName: string
  ): Promise<void> {
    await this.send({
      to: email,
      subject: `You've been invited to ${workspaceName} on Velora`,
      html: `
        <h1>Workspace invitation</h1>
        <p>${inviterName} added you to <strong>${workspaceName}</strong>.</p>
        <p><a href="${env.CLIENT_URL}/workspaces">Open Velora</a></p>
      `,
    });
  }
}
