import { type CanActivate, type ExecutionContext } from "@nestjs/common";
import type { RoomAccessService } from "../../invitations/services/room-access.service";
export declare class RoomAdminGuard implements CanActivate {
    private roomAccessService;
    constructor(roomAccessService: RoomAccessService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
