import { LeaderboardsService } from '../services/leaderboards.service';
interface XpGainedEvent {
    userId: string;
    xpAmount: number;
    source: string;
    timestamp: Date;
}
interface LevelUpEvent {
    userId: string;
    previousLevel: number;
    newLevel: number;
    totalXp: number;
    badgesUnlocked: string[];
    timestamp: Date;
}
interface TipReceivedEvent {
    userId: string;
    tipAmount: number;
    fromUserId: string;
    timestamp: Date;
}
export declare class LeaderboardCacheListener {
    private readonly leaderboardsService;
    private readonly logger;
    constructor(leaderboardsService: LeaderboardsService);
    handleXpGained(event: XpGainedEvent): Promise<void>;
    handleLevelUp(event: LevelUpEvent): Promise<void>;
    handleTipReceived(event: TipReceivedEvent): Promise<void>;
    handleUserCreated(event: {
        userId: string;
        username: string;
        timestamp: Date;
    }): Promise<void>;
    handleUserDeleted(event: {
        userId: string;
        timestamp: Date;
    }): Promise<void>;
}
export {};
