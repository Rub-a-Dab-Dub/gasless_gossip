import { ChallengeParticipation } from './challenge-participation.entity';
export declare enum ChallengeStatus {
    ACTIVE = "active",
    COMPLETED = "completed",
    EXPIRED = "expired",
    CANCELLED = "cancelled"
}
export declare enum ChallengeType {
    GIFT_SENDING = "gift_sending",
    MESSAGE_COUNT = "message_count",
    XP_GAIN = "xp_gain",
    TOKEN_TRANSFER = "token_transfer",
    REFERRAL = "referral",
    CUSTOM = "custom"
}
export declare class Challenge {
    id: string;
    title: string;
    description?: string;
    type: ChallengeType;
    goal: number;
    reward: number;
    status: ChallengeStatus;
    expiresAt: Date;
    completedAt?: Date;
    createdBy?: string;
    metadata?: Record<string, any>;
    participantCount: number;
    completionCount: number;
    participations: ChallengeParticipation[];
    createdAt: Date;
    updatedAt: Date;
}
