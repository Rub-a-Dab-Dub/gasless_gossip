import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { eventListeners } from '@/common/constants';
import { EmailTemplateService } from '@/notification/core/email';
import { Logger } from 'nestjs-pino';

@Injectable()
export class UserEventListeners {
  constructor(
    private readonly emailService: EmailTemplateService,
    private readonly logger: Logger,
  ) {}

  @OnEvent(eventListeners.USER_VERIFICATION_SENT)
  async handleUserVerificationSent(payload: { user: any; token: string }) {
    const { user, token } = payload;

    this.logger.log(`Sending verification email to ${user.email}`);

    const emailSent = await this.emailService.sendEmailTemplate({
      to: user.email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Gasless Gossip!</h2>
          <p>Hi ${user.username},</p>
          <p>Thank you for signing up. Please verify your email address by entering the following code:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${token}
          </div>
          <p style="color: #d32f2f; font-weight: bold;">⏰ This code will expire in 5 minutes.</p>
          <p>If you didn't create an account, please ignore this email.</p>
          <br>
          <p>Best regards,<br>The Gasless Gossip Team</p>
        </div>
      `,
    });

    if (emailSent) {
      this.logger.log(`Verification email sent successfully to ${user.email}`);
    } else {
      this.logger.error(`Failed to send verification email to ${user.email}`);
    }
  }

  @OnEvent(eventListeners.USER_PASSWORD_RESET_SENT)
  async handlePasswordResetSent(payload: { user: any; token: string }) {
    const { user, token } = payload;

    this.logger.log(`Sending password reset email to ${user.email}`);

    const emailSent = await this.emailService.sendEmailTemplate({
      to: user.email,
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hi ${user.username},</p>
          <p>You requested to reset your password. Please use the following code to reset your password:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${token}
          </div>
          <p style="color: #d32f2f; font-weight: bold;">⏰ This code will expire in 5 minutes.</p>
          <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          <br>
          <p>Best regards,<br>The Gasless Gossip Team</p>
        </div>
      `,
    });

    if (emailSent) {
      this.logger.log(
        `Password reset email sent successfully to ${user.email}`,
      );
    } else {
      this.logger.error(`Failed to send password reset email to ${user.email}`);
    }
  }

  @OnEvent(eventListeners.USER_EMAIL_VERIFIED)
  handleUserEmailVerified(payload: { user: any }) {
    const { user } = payload;
    this.logger.log(
      `User ${user.username} (ID: ${user.id}) email verified successfully. Wallet creation initiated.`,
    );
  }
}
