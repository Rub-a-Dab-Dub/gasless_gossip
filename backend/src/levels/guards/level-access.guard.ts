import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class LevelAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.params.userId;

    // In a real application, you would get the current user from JWT token
    // For now, we'll assume the user is authenticated and can access their own data
    // const currentUser = request.user;

    // if (currentUser.id !== userId && !currentUser.isAdmin) {
    //   throw new ForbiddenException('You can only access your own level data');
    // }

    return true;
  }
}
