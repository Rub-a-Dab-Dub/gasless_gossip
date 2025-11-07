import { Body, Controller, Post, Query, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, ForgotPasswordDto, ResetPasswordDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('verify-email/:userId')
  verifyEmail(
    @Param('userId') userId: string,
    @Body('token') token: string,
  ) {
    return this.authService.verifyEmail(+userId, token);
  }

  @Post('resend-verification/:userId')
  resendVerification(@Param('userId') userId: string) {
    return this.authService.resendVerification(+userId);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password/:userId')
  resetPassword(
    @Param('userId') userId: string,
    @Body() body: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(+userId, body.token, body.newPassword);
  }
}
