import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req): Promise<Omit<User, 'password'>> {
    return this.authService.getProfile(req.user);
  }

  @Post('stellar-account')
  @UseGuards(JwtAuthGuard)
  async updateStellarAccount(
    @Request() req,
    @Body('stellarAccountId') stellarAccountId: string,
  ): Promise<{ message: string }> {
    await this.authService.updateStellarAccountId(
      req.user.id,
      stellarAccountId,
    );
    return { message: 'Stellar account ID updated successfully' };
  }
}
