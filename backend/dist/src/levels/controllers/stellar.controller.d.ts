import type { StellarService, BadgeUnlockTransaction } from '../services/stellar.service';
export declare class StellarController {
    private readonly stellarService;
    constructor(stellarService: StellarService);
    unlockBadge(userId: string, badgeId: string, body: {
        level: number;
    }): Promise<BadgeUnlockTransaction>;
    getBadgeUnlockStatus(userId: string, badgeId: string): Promise<BadgeUnlockTransaction | null>;
    validateBadgeOwnership(stellarAccountId: string, badgeId: string): Promise<{
        stellarAccountId: string;
        badgeId: string;
        owns: boolean;
    }>;
    retryTransaction(transactionId: string): Promise<BadgeUnlockTransaction>;
}
