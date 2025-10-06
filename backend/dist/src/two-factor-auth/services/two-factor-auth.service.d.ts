import { Repository } from 'typeorm';
import { TwoFactor, TwoFactorMethod } from '../entities/two-factor.entity';
import { Enable2FADto } from '../dto/enable-2fa.dto';
import { Verify2FADto } from '../dto/verify-2fa.dto';
export declare class TwoFactorAuthService {
    private twoFactorRepository;
    constructor(twoFactorRepository: Repository<TwoFactor>);
    enable2FA(enable2FADto: Enable2FADto): Promise<{
        secret: string;
        qrCode?: string;
    }>;
    verify2FA(verify2FADto: Verify2FADto): Promise<{
        verified: boolean;
    }>;
    is2FAEnabled(userId: string): Promise<boolean>;
    get2FAMethod(userId: string): Promise<TwoFactorMethod | null>;
    disable2FA(userId: string): Promise<void>;
    generateEmailCode(secret: string): string;
}
