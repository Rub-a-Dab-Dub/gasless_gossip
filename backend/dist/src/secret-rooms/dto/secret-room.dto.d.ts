export declare class CreateSecretRoomDto {
    name: string;
    description?: string;
    isPrivate: boolean;
    maxUsers?: number;
    category?: string;
    theme?: string;
    settings?: {
        allowAnonymous?: boolean;
        requireApproval?: boolean;
        autoDelete?: boolean;
        deleteAfterHours?: number;
        allowFileSharing?: boolean;
        maxFileSize?: number;
        moderationLevel?: 'low' | 'medium' | 'high';
    };
    metadata?: {
        tags?: string[];
        location?: string;
        timezone?: string;
        language?: string;
        ageRestriction?: number;
    };
}
export declare class UpdateSecretRoomDto {
    name?: string;
    description?: string;
    isPrivate?: boolean;
    maxUsers?: number;
    category?: string;
    theme?: string;
    settings?: {
        allowAnonymous?: boolean;
        requireApproval?: boolean;
        autoDelete?: boolean;
        deleteAfterHours?: number;
        allowFileSharing?: boolean;
        maxFileSize?: number;
        moderationLevel?: 'low' | 'medium' | 'high';
    };
    metadata?: {
        tags?: string[];
        location?: string;
        timezone?: string;
        language?: string;
        ageRestriction?: number;
    };
}
export declare class JoinRoomDto {
    roomCode: string;
    nickname?: string;
    isAnonymous?: boolean;
}
export declare class InviteUserDto {
    email?: string;
    userId?: string;
    message?: string;
    role?: 'member' | 'moderator' | 'admin';
    expiresInDays?: number;
}
export declare class SecretRoomDto {
    id: string;
    creatorId: string;
    name: string;
    description?: string;
    roomCode: string;
    isPrivate: boolean;
    isActive: boolean;
    status: string;
    maxUsers: number;
    currentUsers: number;
    category?: string;
    theme?: string;
    settings?: Record<string, any>;
    metadata?: Record<string, any>;
    lastActivityAt?: Date;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class RoomMemberDto {
    id: string;
    roomId: string;
    userId: string;
    role: string;
    status: string;
    nickname?: string;
    displayName?: string;
    isAnonymous: boolean;
    canInvite: boolean;
    canModerate: boolean;
    messageCount: number;
    reactionCount: number;
    lastSeenAt?: Date;
    lastMessageAt?: Date;
    permissions?: Record<string, any>;
    metadata?: Record<string, any>;
    joinedAt: Date;
    updatedAt: Date;
}
export declare class RoomInvitationDto {
    id: string;
    roomId: string;
    invitedBy: string;
    invitedUserId?: string;
    invitedEmail?: string;
    invitationCode: string;
    status: string;
    message?: string;
    role?: string;
    expiresInDays: number;
    expiresAt?: Date;
    acceptedAt?: Date;
    declinedAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
}
export declare class RoomStatsDto {
    totalRooms: number;
    activeRooms: number;
    privateRooms: number;
    publicRooms: number;
    totalMembers: number;
    averageMembersPerRoom: number;
    roomsCreatedToday: number;
    roomsCreatedThisWeek: number;
}
export declare class UserRoomLimitDto {
    userId: string;
    currentRooms: number;
    maxRooms: number;
    canCreateMore: boolean;
    remainingSlots: number;
}
