import { Injectable, Logger } from '@nestjs/common';
import { SendVerifyUserEmailDto } from './dto/create-email.dto';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import * as path from 'path';
import { EmailTemplateService } from '@/notification/core/email';
import { IUser } from '@/common/interfaces';

@Injectable()
export class EmailService {
  private partialsRegistered = false;
  private logger = new Logger(EmailService.name);

  constructor(private email: EmailTemplateService) {
    // Register partials when the service is instantiated
    this.registerPartials();
  }
  onModuleInit() {
    this.logger.debug('EmailService initialized');
    this.sendTestEmail('praiseleye.pl@gmail.com').catch((err) =>
      this.logger.error('Test email failed', err),
    );
  }

  private registerPartials() {
    if (this.partialsRegistered) return;

    try {
      const partialsDir = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'assets',
        'views',
        'partials',
      );

      const headerPath = path.join(partialsDir, 'header.hbs');
      const footerPath = path.join(partialsDir, 'footer.hbs');

      // Check if files exist before trying to read them
      if (fs.existsSync(headerPath)) {
        const headerContent = fs.readFileSync(headerPath, 'utf8');
        Handlebars.registerPartial('header', headerContent);
        console.log('✅ Header partial registered successfully');
      } else {
        console.warn('⚠️ Header partial not found at:', headerPath);
      }

      if (fs.existsSync(footerPath)) {
        const footerContent = fs.readFileSync(footerPath, 'utf8');
        Handlebars.registerPartial('footer', footerContent);
        console.log('✅ Footer partial registered successfully');
      } else {
        console.warn('⚠️ Footer partial not found at:', footerPath);
      }

      this.partialsRegistered = true;
    } catch (error) {
      console.error('❌ Error registering partials:', error);
    }
  }

  private renderHtmlTemplates = (template: string, data: any) => {
    // Ensure partials are registered before rendering
    this.registerPartials();

    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'assets',
      'views',
      `${template}.hbs`,
    );

    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`Template file not found: ${filePath}`);
      }

      const source = fs.readFileSync(filePath, 'utf8');
      Handlebars.registerHelper('splitToken', function (token) {
        return token ? token.split('') : [];
      });
      const handleBarsTemplate = Handlebars.compile(source);
      return handleBarsTemplate(data);
    } catch (error) {
      console.error(`❌ Error rendering template ${template}:`, error);
      throw error;
    }
  };

  // ... rest of your methods remain the same
  create(sendVerifyUserEmailDto: SendVerifyUserEmailDto) {
    this.email.sendEmailTemplate({
      to: 'praise@albatross.live',
      subject: 'Test',
      html: this.renderHtmlTemplates('welcome-user', {
        first_name: 'test',
        token: '084565',
      }),
    });
    return 'This action adds a new email';
  }

  async sendVerifyUserEmail(
    sendVerifyUserEmailDto: IUser & { token?: string },
  ) {
    console.log(
      '🚀 ~ EmailService ~ sendVerifyUserEmailDto:',
      sendVerifyUserEmailDto,
    );

    if (!sendVerifyUserEmailDto.email) {
      console.error('Cannot send verification email: email address is missing');
      return;
    }

    await this.email.sendEmailTemplate({
      to: sendVerifyUserEmailDto.email,
      subject: 'Verify your email',
      html: this.renderHtmlTemplates('verify-user', {
        ...sendVerifyUserEmailDto,
      }),
    });
  }

  async sendWelcomeEmail(user: IUser) {
    if (!user.email) {
      console.error('Cannot send welcome email: email address is missing');
      return;
    }

    await this.email.sendEmailTemplate({
      to: user.email,
      subject: 'Welcome user',
      html: this.renderHtmlTemplates('welcome-user', {
        first_name: user.username,
      }),
    });
  }

  async sendTestEmail(to: string) {
    try {
      await this.email.sendEmailTemplate({
        to,
        subject: 'Test Email',
        html: this.renderHtmlTemplates('index', {
          first_name: 'Test User',
        }),
      });
    } catch (error) {
      console.error('❌ Error sending test email:', error);
      this.logger.log('❌ Error sending test email:', error);
      throw error;
    }
  }
}
