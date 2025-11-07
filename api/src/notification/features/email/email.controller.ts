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
}
