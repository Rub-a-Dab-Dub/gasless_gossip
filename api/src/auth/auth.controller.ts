import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() authDto: AuthDto) {
    return this.authService.signup(authDto.username, authDto.password);
  }

  @Post('login')
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto.username, authDto.password);
  }
}
