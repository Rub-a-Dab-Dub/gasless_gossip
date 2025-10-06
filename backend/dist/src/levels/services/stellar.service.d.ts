import type { ConfigService } from '@nestjs/config';
import type { EventEmitter2 } from '@nestjs/event-emitter';
import type { LevelUpEvent } from '../events/level-up.event';
export interface StellarBadgeContract {
    contractAddress: string;
    networkPassphrase: string;
    sourceAccount: string;
}
export interface BadgeUnlockTransaction {
    userId: string;
    stellarAccountId: string;
    badgeId: string;
    level: number;
    transactionHash?: string;
    status: 'pending' | 'success' | 'failed';
    error?: string;
    createdAt: Date;
    completedAt?: Date;
}
export declare class StellarService {
    private readonly configService;
    private readonly eventEmitter;
    private readonly logger;
    private readonly contractConfig;
    constructor(configService: ConfigService, eventEmitter: EventEmitter2);
    handleLevelUpBadgeUnlock(event: LevelUpEvent): Promise<void>;
    unlockBadgeOnStellar(userId: string, stellarAccountId: string, badgeId: string, level: number): Promise<BadgeUnlockTransaction>;
    private submitBadgeUnlockTransaction;
    private getUserStellarAccount;
    getBadgeUnlockStatus(userId: string, badgeId: string): Promise<BadgeUnlockTransaction | null>;
    retryFailedBadgeUnlock(transactionId: string): Promise<BadgeUnlockTransaction>;
    validateBadgeOwnership(stellarAccountId: string, badgeId: string): Promise<boolean>;
}
