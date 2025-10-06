import { Challenge } from './challenge.entity';
export declare enum ParticipationStatus {
    ACTIVE = "active",
    COMPLETED = "completed",
    FAILED = "failed",
    ABANDONED = "abandoned"
}
export declare class ChallengeParticipation {
    id: string;
    userId: string;
    challengeId: string;
    status: ParticipationStatus;
    progress: number;
    rewardEarned: number;
    completedAt?: Date;
    progressData?: Record<string, any>;
    stellarTransactionId?: string;
    challenge: Challenge;
    createdAt: Date;
    updatedAt: Date;
}
