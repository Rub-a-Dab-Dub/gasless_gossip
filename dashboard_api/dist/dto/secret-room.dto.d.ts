import { RoomType, RoomStatus } from '../entities/room.entity';
import { FakeNameTheme } from '../services/fake-name-generator.service';
export declare class CreateSecretRoomDto {
    name: string;
    description?: string;
    type: RoomType;
    isPrivate?: boolean;
    maxParticipants?: number;
    theme?: string;
    enablePseudonyms?: boolean;
    fakeNameTheme?: FakeNameTheme;
    expiresAt?: Date;
    xpMultiplier?: number;
    settings?: {
        allowAnonymous?: boolean;
        requireApproval?: boolean;
        autoDelete?: boolean;
        deleteAfterHours?: number;
        allowFileSharing?: boolean;
        maxFileSize?: number;
        moderationLevel?: 'low' | 'medium' | 'high';
    };
    moderationSettings?: {
        creatorModPrivileges?: boolean;
        autoModeration?: boolean;
        voiceModerationQueue?: boolean;
        maxViolationsBeforeAutoDelete?: number;
        pseudonymDecryption?: boolean;
    };
    metadata?: {
        tags?: string[];
        location?: string;
        timezone?: string;
        language?: string;
        ageRestriction?: number;
    };
    moderatorIds?: string[];
}
export declare class UpdateSecretRoomDto {
    name?: string;
    description?: string;
    isPrivate?: boolean;
    maxParticipants?: number;
    theme?: string;
    enablePseudonyms?: boolean;
    fakeNameTheme?: FakeNameTheme;
    expiresAt?: Date;
    status?: RoomStatus;
    xpMultiplier?: number;
    settings?: {
        allowAnonymous?: boolean;
        requireApproval?: boolean;
        autoDelete?: boolean;
        deleteAfterHours?: number;
        allowFileSharing?: boolean;
        maxFileSize?: number;
        moderationLevel?: 'low' | 'medium' | 'high';
    };
    moderationSettings?: {
        creatorModPrivileges?: boolean;
        autoModeration?: boolean;
        voiceModerationQueue?: boolean;
        maxViolationsBeforeAutoDelete?: number;
        pseudonymDecryption?: boolean;
    };
    metadata?: {
        tags?: string[];
        location?: string;
        timezone?: string;
        language?: string;
        ageRestriction?: number;
    };
    moderatorIds?: string[];
}
export declare class JoinRoomDto {
    roomCode: string;
    usePseudonym?: boolean;
    fakeNameTheme?: FakeNameTheme;
}
export declare class InviteUserDto {
    userId: string;
    message?: string;
}
export declare class SendTokenTipDto {
    recipientUserId: string;
    amount: number;
    token: string;
    message?: string;
    usePseudonym?: boolean;
}
export declare class RoomReactionDto {
    messageId: string;
    emoji: string;
}
export declare class VoiceNoteDto {
    voiceNoteUrl: string;
    duration: number;
    transcript?: string;
}
export declare class ModerationActionDto {
    targetUserId: string;
    action: 'warn' | 'mute' | 'kick' | 'ban';
    reason?: string;
    durationMinutes?: number;
}
export declare class SecretRoomResponseDto {
    id: string;
    name: string;
    description?: string;
    type: RoomType;
    creatorId: string;
    roomCode?: string;
    isPrivate: boolean;
    isActive: boolean;
    status: RoomStatus;
    maxParticipants: number;
    currentUsers: number;
    theme?: string;
    enablePseudonyms: boolean;
    fakeNameTheme: string;
    xpMultiplier: number;
    expiresAt?: Date;
    lastActivityAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    moderationSettings?: any;
    reactionMetrics?: any;
    settings?: any;
    metadata?: any;
    moderatorIds?: string[];
}
export declare class RoomParticipantDto {
    userId: string;
    pseudonym?: string;
    joinedAt: Date;
    role: 'creator' | 'moderator' | 'member';
    isActive: boolean;
}
export declare class RoomStatsDto {
    totalParticipants: number;
    activeParticipants: number;
    totalMessages: number;
    totalReactions: number;
    totalTokenTips: number;
    averageSessionDuration: number;
    trendingScore: number;
    moderationQueueLength: number;
}
export declare class UserRoomLimitDto {
    currentRooms: number;
    maxRooms: number;
    canCreateMore: boolean;
}
export declare class RoomInvitationDto {
    id: string;
    roomId: string;
    roomName: string;
    inviterId: string;
    inviterName: string;
    invitedUserId: string;
    message?: string;
    status: 'pending' | 'accepted' | 'declined' | 'expired';
    createdAt: Date;
    expiresAt?: Date;
}
export declare class ModerationQueueStatusDto {
    totalItems: number;
    pendingItems: number;
    processingItems: number;
    queueCapacity: number;
    averageProcessingTime: number;
    yourPosition?: number;
}
export declare class FakeNamePreviewDto {
    theme: FakeNameTheme;
    samples: string[];
}
