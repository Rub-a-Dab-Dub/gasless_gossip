import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class RoomAccessGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
    private checkRoomAccess;
}
