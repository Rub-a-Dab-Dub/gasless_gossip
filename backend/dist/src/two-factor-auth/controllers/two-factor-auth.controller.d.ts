import { TwoFactorAuthService } from '../services/two-factor-auth.service';
import { Enable2FADto } from '../dto/enable-2fa.dto';
import { Verify2FADto } from '../dto/verify-2fa.dto';
export declare class TwoFactorAuthController {
    private readonly twoFactorAuthService;
    constructor(twoFactorAuthService: TwoFactorAuthService);
    enable2FA(enable2FADto: Enable2FADto, req: any): Promise<{
        message: string;
        secret: string;
        qrCode: string | undefined;
        method: import("../entities/two-factor.entity").TwoFactorMethod;
    }>;
    verify2FA(verify2FADto: Verify2FADto, req: any): Promise<{
        message: string;
        verified: boolean;
    }>;
    disable2FA(req: any): Promise<{
        message: string;
    }>;
}
