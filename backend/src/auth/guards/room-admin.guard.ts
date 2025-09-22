import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from "@nestjs/common"
import type { RoomAccessService } from "../../invitations/services/room-access.service"

@Injectable()
export class RoomAdminGuard implements CanActivate {
  constructor(private roomAccessService: RoomAccessService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new ForbiddenException("Authentication required")
    }

    // Extract roomId from route parameters or request body
    const roomId = request.params.roomId || request.body.roomId

    if (!roomId) {
      throw new ForbiddenException("Room ID is required")
    }

    try {
      // Verify user has admin permissions for the room
      await this.roomAccessService.verifyRoomAdmin(roomId, user.id)
      return true
    } catch (error) {
      throw new ForbiddenException("Admin permissions required for this room")
    }
  }
}
