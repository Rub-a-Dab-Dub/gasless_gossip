import { ChallengeStatus, ChallengeType } from '../entities/challenge.entity';
import { ParticipationStatus } from '../entities/challenge-participation.entity';
export declare class ChallengeResponseDto {
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
    createdAt: Date;
    updatedAt: Date;
}
export declare class ChallengeParticipationResponseDto {
    id: string;
    userId: string;
    challengeId: string;
    status: ParticipationStatus;
    progress: number;
    rewardEarned: number;
    completedAt?: Date;
    progressData?: Record<string, any>;
    stellarTransactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ChallengeStatsDto {
    totalChallenges: number;
    activeChallenges: number;
    completedChallenges: number;
    totalRewardsEarned: number;
    participationRate: number;
}
