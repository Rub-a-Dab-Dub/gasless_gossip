import { Room } from '../../rooms/entities/room.entity';
import { User } from '../../users/entities/user.entity';
import { PredictionVote } from './prediction-vote.entity';
export declare enum PredictionStatus {
    ACTIVE = "active",
    RESOLVED = "resolved",
    CANCELLED = "cancelled"
}
export declare enum PredictionOutcome {
    CORRECT = "correct",
    INCORRECT = "incorrect",
    PENDING = "pending"
}
export declare class Prediction {
    id: string;
    roomId: string;
    userId: string;
    title: string;
    description?: string;
    prediction: string;
    expiresAt: Date;
    status: PredictionStatus;
    outcome: PredictionOutcome;
    voteCount: number;
    correctVotes: number;
    incorrectVotes: number;
    rewardPool: number;
    rewardPerCorrectVote: number;
    isResolved: boolean;
    resolvedAt?: Date;
    room: Room;
    user: User;
    votes: PredictionVote[];
    createdAt: Date;
    updatedAt: Date;
}
