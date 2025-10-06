export declare class RoomMember {
    id: string;
    roomId: string;
    userId: string;
    role: 'member' | 'moderator' | 'admin' | 'owner';
    status: 'active' | 'inactive' | 'banned' | 'left';
    nickname?: string;
    displayName?: string;
    isAnonymous: boolean;
    canInvite: boolean;
    canModerate: boolean;
    messageCount: number;
    reactionCount: number;
    lastSeenAt?: Date;
    lastMessageAt?: Date;
    leftAt?: Date;
    bannedAt?: Date;
    banReason?: string;
    permissions?: {
        canPost?: boolean;
        canReact?: boolean;
        canShare?: boolean;
        canDelete?: boolean;
        canEdit?: boolean;
    };
    metadata?: {
        joinSource?: string;
        invitationId?: string;
        referrer?: string;
    };
    joinedAt: Date;
    updatedAt: Date;
}
