import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TwoFactorAuthService } from '../services/two-factor-auth.service';
import { Enable2FADto } from '../dto/enable-2fa.dto';
import { Verify2FADto } from '../dto/verify-2fa.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // Assuming you have JWT auth

@Controller('2fa')
@UseGuards(JwtAuthGuard)
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

  @Post('enable')
  @HttpCode(HttpStatus.OK)
  async enable2FA(@Body() enable2FADto: Enable2FADto, @Request() req) {
    // Override userId with authenticated user's ID for security
    const userId = req.user.id;

    const result = await this.twoFactorAuthService.enable2FA({
      ...enable2FADto,
      userId,
    });

    return {
      message: '2FA setup initiated. Please verify with the provided code.',
      secret: result.secret,
      qrCode: result.qrCode,
      method: enable2FADto.method,
    };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify2FA(@Body() verify2FADto: Verify2FADto, @Request() req) {
    // Override userId with authenticated user's ID for security
    const userId = req.user.id;

    const result = await this.twoFactorAuthService.verify2FA({
      ...verify2FADto,
      userId,
    });

    if (result.verified) {
      return {
        message: '2FA successfully enabled and verified.',
        verified: true,
      };
    } else {
      return {
        message: 'Invalid verification code.',
        verified: false,
      };
    }
  }

  @Post('disable')
  @HttpCode(HttpStatus.OK)
  async disable2FA(@Request() req) {
    const userId = req.user.id;
    await this.twoFactorAuthService.disable2FA(userId);

    return {
      message: '2FA has been disabled.',
    };
  }
}
