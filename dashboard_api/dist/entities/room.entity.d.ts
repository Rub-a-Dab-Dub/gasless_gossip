import { Participant } from './participant.entity';
import { Message } from './message.entity';
import { Transaction } from './transaction.entity';
export declare enum RoomType {
    SECRET = "secret",
    DEGEN = "degen",
    VOICE_DROP = "voice_drop",
    GATED = "gated"
}
export declare enum RoomStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    DELETED = "deleted",
    SUSPENDED = "suspended"
}
export declare class Room {
    id: string;
    name: string;
    type: RoomType;
    creatorId: string;
    expiresAt: Date;
    maxParticipants: number;
    theme: string;
    accessRules: Record<string, any>;
    moderatorIds: string[];
    pinnedMessageId: string;
    isClosed: boolean;
    activityLevel: number;
    status: RoomStatus;
    enablePseudonyms: boolean;
    fakeNameTheme: string;
    xpMultiplier: number;
    settings: {
        allowAnonymous?: boolean;
        autoDelete?: boolean;
        deleteAfterHours?: number;
        moderationLevel?: 'low' | 'medium' | 'high';
    };
    moderationSettings: {
        creatorModPrivileges?: boolean;
        autoModeration?: boolean;
        voiceModerationQueue?: boolean;
        pseudonymDecryption?: boolean;
    };
    reactionMetrics: {
        totalReactions?: number;
        topEmojis?: Record<string, number>;
        averageReactionsPerMessage?: number;
    };
    roomCode: string;
    lastActivity: Date;
    schedulerData: {
        nextCleanup?: Date;
        cleanupJobId?: string;
        processingStats?: Record<string, number>;
    };
    createdAt: Date;
    updatedAt: Date;
    participants: Participant[];
    messages: Message[];
    transactions: Transaction[];
}
