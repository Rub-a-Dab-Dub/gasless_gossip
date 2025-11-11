import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendVerifyUserEmailDto } from './dto/create-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  create(@Body() createEmailDto: SendVerifyUserEmailDto) {
    return this.emailService.create(createEmailDto);
  }

  @Post('send-test')
  sendTestEmail(@Body('to') to: string) {
    if (!to || to.trim() === '' || !to.includes('@')) {
      throw new Error('Recipient email address is required');
    }
    return this.emailService.sendTestEmail(to);
  }
}
