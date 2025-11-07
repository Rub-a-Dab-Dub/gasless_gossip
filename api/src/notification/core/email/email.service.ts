import { Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailTemplateService {
  private readonly transport: nodeMailer.Transporter;
  constructor(
    private logger: Logger,
    private configService: ConfigService,
  ) {
    this.transport = nodeMailer.createTransport({
      host: this.configService.get<string>('ZEPTO_HOST'),
      port: this.configService.get<number>('ZEPTO_PORT'),
      auth: {
        user: this.configService.get<string>('ZEPTO_USER'),
        pass: this.configService.get<string>('ZEPTO_PASS'),
      },
    });
  }

  async sendEmailTemplate(payload: nodeMailer.SendMailOptions) {
    try {
      await this.transport.sendMail({
        ...payload,
        from: '"Example Team" <noreply@nextcba.com>',
      });
      this.logger.log('Email sent successfully');
      return true;
    } catch (error) {
      console.log("🚀 ~ EmailTemplateService ~ sendEmailTemplate ~ error:", error)
      this.logger.error(error);
      return false;
    }
  }
}
