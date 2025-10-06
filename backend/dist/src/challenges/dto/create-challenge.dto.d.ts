import { ChallengeType } from '../entities/challenge.entity';
export declare class CreateChallengeDto {
    title: string;
    description?: string;
    type: ChallengeType;
    goal: number;
    reward: number;
    expiresAt: string;
    metadata?: Record<string, any>;
}
