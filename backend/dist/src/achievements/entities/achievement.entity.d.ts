import { User } from '../../users/entities/user.entity';
export declare enum AchievementType {
    MESSAGES_SENT = "messages_sent",
    ROOMS_JOINED = "rooms_joined",
    PREDICTIONS_MADE = "predictions_made",
    BETS_PLACED = "bets_placed",
    GAMBLES_PLAYED = "gambles_played",
    TRADES_COMPLETED = "trades_completed",
    VISITS_MADE = "visits_made",
    LEVEL_REACHED = "level_reached",
    STREAK_DAYS = "streak_days",
    TOKENS_EARNED = "tokens_earned"
}
export declare enum AchievementTier {
    BRONZE = "bronze",
    SILVER = "silver",
    GOLD = "gold",
    PLATINUM = "platinum",
    DIAMOND = "diamond"
}
export declare class Achievement {
    id: string;
    userId: string;
    type: AchievementType;
    tier: AchievementTier;
    milestoneValue: number;
    rewardAmount: number;
    stellarTransactionHash?: string;
    isClaimed: boolean;
    awardedAt: Date;
    user?: User;
}
