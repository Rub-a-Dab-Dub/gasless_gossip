import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminKycGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Extracted from JWT by AuthGuard

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const allowedRoles = ['admin', 'kyc_reviewer', 'moderator'];
    
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Admin or KYC reviewer access required');
    }

    return true;
  }
}