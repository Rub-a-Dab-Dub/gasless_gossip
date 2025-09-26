import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TwoFactor, TwoFactorMethod } from '../entities/two-factor.entity';
import { Enable2FADto } from '../dto/enable-2fa.dto';
import { Verify2FADto } from '../dto/verify-2fa.dto';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    @InjectRepository(TwoFactor)
    private twoFactorRepository: Repository<TwoFactor>,
  ) {}

  async enable2FA(
    enable2FADto: Enable2FADto,
  ): Promise<{ secret: string; qrCode?: string }> {
    const { userId, method } = enable2FADto;

    // Check if 2FA is already enabled for this user
    const existing2FA = await this.twoFactorRepository.findOne({
      where: { userId },
    });

    if (existing2FA && existing2FA.isEnabled) {
      throw new BadRequestException('2FA is already enabled for this user');
    }

    let secret: string;
    let qrCode: string | undefined;

    if (method === TwoFactorMethod.TOTP) {
      // Generate TOTP secret
      const secretObj = speakeasy.generateSecret({
        name: `Whisper (${userId})`,
        issuer: 'Whisper',
      });
      secret = secretObj.base32;

      // Generate QR code for easy setup
      qrCode = await QRCode.toDataURL(secretObj.otpauth_url);
    } else {
      // For email method, generate a random secret for verification codes
      secret = speakeasy.generateSecret({ length: 20 }).base32;
    }

    // Save or update 2FA settings
    if (existing2FA) {
      existing2FA.method = method;
      existing2FA.secret = secret;
      existing2FA.isEnabled = false; // Will be enabled after verification
      await this.twoFactorRepository.save(existing2FA);
    } else {
      const newTwoFactor = this.twoFactorRepository.create({
        userId,
        method,
        secret,
        isEnabled: false,
      });
      await this.twoFactorRepository.save(newTwoFactor);
    }

    return { secret, qrCode };
  }

  async verify2FA(verify2FADto: Verify2FADto): Promise<{ verified: boolean }> {
    const { userId, code } = verify2FADto;

    const twoFactor = await this.twoFactorRepository.findOne({
      where: { userId },
    });

    if (!twoFactor) {
      throw new NotFoundException('2FA not configured for this user');
    }

    let isValid = false;

    if (twoFactor.method === TwoFactorMethod.TOTP) {
      // Verify TOTP code
      isValid = speakeasy.totp.verify({
        secret: twoFactor.secret,
        encoding: 'base32',
        token: code,
        window: 2, // Allow 2 time steps (1 minute) tolerance
      });
    } else if (twoFactor.method === TwoFactorMethod.EMAIL) {
      // For email verification, you would implement your email sending logic
      // and store temporary codes. For this example, we'll use the same TOTP logic
      isValid = speakeasy.totp.verify({
        secret: twoFactor.secret,
        encoding: 'base32',
        token: code,
        window: 6, // Longer window for email codes
      });
    }

    if (isValid) {
      // Enable 2FA and update last used timestamp
      twoFactor.isEnabled = true;
      twoFactor.lastUsedAt = new Date();
      await this.twoFactorRepository.save(twoFactor);
    }

    return { verified: isValid };
  }

  async is2FAEnabled(userId: string): Promise<boolean> {
    const twoFactor = await this.twoFactorRepository.findOne({
      where: { userId, isEnabled: true },
    });
    return !!twoFactor;
  }

  async get2FAMethod(userId: string): Promise<TwoFactorMethod | null> {
    const twoFactor = await this.twoFactorRepository.findOne({
      where: { userId, isEnabled: true },
    });
    return twoFactor?.method || null;
  }

  async disable2FA(userId: string): Promise<void> {
    await this.twoFactorRepository.update(
      { userId },
      { isEnabled: false, secret: null },
    );
  }

  generateEmailCode(secret: string): string {
    // Generate a time-based code for email 2FA
    return speakeasy.totp({
      secret,
      encoding: 'base32',
      step: 300, // 5 minutes validity
    });
  }
}
