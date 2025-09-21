import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RoomAccessGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { roomId } = request.body || request.query;
    const user = request.user;

    // Implement your room access logic here
    // Example: check if user has access to the room
    const hasAccess = await this.checkRoomAccess(user, roomId);

    if (!hasAccess) {
      throw new ForbiddenException('No access to this room');
    }

    return true;
  }

  private async checkRoomAccess(user: any, roomId: string): Promise<boolean> {
    // Implement your room access verification logic
    return true;
  }
}