import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TwoFactorAuthService } from '../services/two-factor-auth.service';

@Injectable()
export class TwoFactorAuthGuard implements CanActivate {
  constructor(private twoFactorAuthService: TwoFactorAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const is2FAEnabled = await this.twoFactorAuthService.is2FAEnabled(user.id);

    if (is2FAEnabled && !request.headers['x-2fa-verified']) {
      throw new UnauthorizedException('2FA verification required');
    }

    return true;
  }
}
