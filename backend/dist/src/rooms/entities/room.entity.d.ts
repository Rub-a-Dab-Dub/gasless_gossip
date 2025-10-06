import { RoomMembership } from './room-membership.entity';
export declare enum RoomType {
    PUBLIC = "public",
    PRIVATE = "private",
    INVITE_ONLY = "invite_only"
}
export declare class Room {
    id: string;
    name: string;
    description?: string;
    type: RoomType;
    maxMembers: number;
    createdBy: string;
    isActive: boolean;
    minLevel: number;
    minXp: number;
    memberships: RoomMembership[];
    createdAt: Date;
    updatedAt: Date;
}
