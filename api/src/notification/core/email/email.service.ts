import { Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailTemplateService {
  private readonly transport: nodeMailer.Transporter;
  private isEmailConfigured: boolean = false;

  constructor(
    private logger: Logger,
    private configService: ConfigService,
  ) {
    const host = this.configService.get<string>('ZEPTO_HOST');
    const portString = this.configService.get<string>('ZEPTO_PORT');
    const port = parseInt(portString || '587', 10);
    const user = this.configService.get<string>('ZEPTO_USER');
    const pass = this.configService.get<string>('ZEPTO_PASS');

    // Check if email is properly configured
    if (!host || !user || !pass) {
      this.logger.warn(
        'Email service not configured. Emails will not be sent.',
      );
      this.isEmailConfigured = false;
      return;
    }

    // Log configuration (without password)
    this.logger.log(
      `Email config - Host: ${host}, Port: ${port}, User: ${user}`,
    );

    this.transport = nodeMailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000, // 10 seconds timeout
      greetingTimeout: 10000,
      socketTimeout: 10000,
      pool: true, // Use pooled connections
      maxConnections: 5,
      maxMessages: 100,
      // For debugging
      debug: true,
      logger: true,
    });

    this.isEmailConfigured = true;

    // Test connection asynchronously (don't block startup)
    void this.testConnection();
  }

  private async testConnection() {
    try {
      await this.transport.verify();
      this.logger.log('✅ Email service connected successfully');
    } catch (error) {
      this.logger.error('❌ Email service connection failed:', error.message);
      this.logger.warn('App will continue but emails will not be sent');
      this.isEmailConfigured = false;
    }
  }

  async sendEmailTemplate(payload: nodeMailer.SendMailOptions) {
    // Check if email is configured
    if (!this.isEmailConfigured) {
      this.logger.warn(
        'Email service not configured. Email not sent to:',
        payload.to,
      );
      return false;
    }

    try {
      const result = await this.transport.sendMail({
        ...payload,
        from: payload.from || 'GaslessGossip <hello@gaslessgossip.com>',
      });

      this.logger.log(`✅ Email sent successfully to ${payload.to}`);
      this.logger.debug(`Message ID: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(
        '❌ EmailTemplateService ~ sendEmailTemplate ~ error:',
        error,
      );
      // Provide more detailed error information
      if (error.code === 'ETIMEDOUT') {
        this.logger.error(
          '⏱️ Email server connection timeout. Check network/firewall settings.',
        );
        this.logger.error(
          'Try: 1) Check if port 587 is open, 2) Try port 465, 3) Check firewall rules',
        );
      } else if (error.code === 'ECONNREFUSED') {
        this.logger.error(
          '🚫 Email server refused connection. Check host and port.',
        );
      } else if (error.code === 'EAUTH') {
        this.logger.error('🔑 Email authentication failed. Check credentials.');
      } else if (error.code === 'ESOCKET') {
        this.logger.error('🔌 Socket error. Network connectivity issue.');
      }

      return false;
    }
  }
}
