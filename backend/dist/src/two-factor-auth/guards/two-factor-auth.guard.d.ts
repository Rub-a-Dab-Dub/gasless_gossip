import { CanActivate, ExecutionContext } from '@nestjs/common';
import { TwoFactorAuthService } from '../services/two-factor-auth.service';
export declare class TwoFactorAuthGuard implements CanActivate {
    private twoFactorAuthService;
    constructor(twoFactorAuthService: TwoFactorAuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
