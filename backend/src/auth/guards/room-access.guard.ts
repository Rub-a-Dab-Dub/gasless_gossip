import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from "@nestjs/common"
import type { RoomAccessService } from "../../invitations/services/room-access.service"

@Injectable()
export class RoomAccessGuard implements CanActivate {
  constructor(private roomAccessService: RoomAccessService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new ForbiddenException("Authentication required")
    }

    // Extract roomId from route parameters
    const roomId = request.params.roomId

    if (!roomId) {
      throw new ForbiddenException("Room ID is required")
    }

    try {
      // Verify user has access to the room
      await this.roomAccessService.verifyRoomAccess(roomId, user.id)
      return true
    } catch (error) {
      throw new ForbiddenException("Access denied to this room")
    }
  }
}
