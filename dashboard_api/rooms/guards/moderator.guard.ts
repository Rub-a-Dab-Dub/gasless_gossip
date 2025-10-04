import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ModeratorGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireModerator = this.reflector.get<boolean>('moderator', context.getHandler());
    
    if (!requireModerator) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Extracted from JWT by AuthGuard

    if (!user || user.role !== 'moderator') {
      throw new ForbiddenException('Moderator access required');
    }

    return true;
  }
}