import { Controller, Get } from '@nestjs/common';
import { CsrfProtectionService } from './csrf-protection.service';
import { CsrfToken } from './interfaces/csrf-token.interface';

@Controller('csrf')
export class CsrfProtectionController {
  constructor(private readonly csrfProtectionService: CsrfProtectionService) {}

  @Get('token')
  getCsrfToken(): CsrfToken {
    return this.csrfProtectionService.generateToken();
  }
}