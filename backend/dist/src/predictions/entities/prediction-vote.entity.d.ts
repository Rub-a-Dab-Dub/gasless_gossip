import { Prediction } from './prediction.entity';
import { User } from '../../users/entities/user.entity';
export declare class PredictionVote {
    id: string;
    predictionId: string;
    userId: string;
    isCorrect: boolean;
    rewardAmount: number;
    rewardClaimed: boolean;
    txId?: string;
    prediction: Prediction;
    user: User;
    createdAt: Date;
}
