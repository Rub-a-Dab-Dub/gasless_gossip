import { Room } from './room.entity';
export declare enum MembershipRole {
    MEMBER = "member",
    ADMIN = "admin",
    OWNER = "owner"
}
export declare class RoomMembership {
    id: string;
    roomId: string;
    userId: string;
    role: MembershipRole;
    invitedBy?: string;
    isActive: boolean;
    room: Room;
    joinedAt: Date;
}
