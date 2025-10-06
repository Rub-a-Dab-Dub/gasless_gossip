import { User } from "../../users/entities/user.entity";
export declare enum ParticipantRole {
    OWNER = "owner",
    ADMIN = "admin",
    MEMBER = "member",
    GUEST = "guest"
}
export declare enum ParticipantStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BANNED = "banned",
    LEFT = "left"
}
export declare class RoomParticipant {
    id: string;
    roomId: string;
    userId: string;
    role: ParticipantRole;
    status: ParticipantStatus;
    invitationId?: string;
    joinedAt?: Date;
    lastActiveAt?: Date;
    permissions?: Record<string, boolean>;
    user: User;
    createdAt: Date;
    get isActive(): boolean;
    get canInvite(): boolean;
    get canManage(): boolean;
}
