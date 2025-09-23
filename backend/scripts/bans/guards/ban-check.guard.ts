import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { BansService } from '../bans.service';

@Injectable()
export class BanCheckGuard implements CanActivate {
  constructor(private bansService: BansService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      return true; // Let auth guard handle authentication
    }

    const isBanned = await this.bansService.isUserBanned(user.id);
    
    if (isBanned) {
      const banDetails = await this.bansService.getBanByUserId(user.id);
      throw new ForbiddenException({
        message: 'Your account has been banned',
        banDetails: banDetails.banDetails,
      });
    }

    return true;
  }
}