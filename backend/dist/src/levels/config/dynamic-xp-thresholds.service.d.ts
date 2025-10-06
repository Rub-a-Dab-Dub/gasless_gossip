import type { XpThresholdConfig } from './xp-thresholds.config';
export interface DynamicXpThreshold {
    id: string;
    level: number;
    xpRequired: number;
    badgeUnlocked?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class DynamicXpThresholdsService {
    private readonly logger;
    private cachedThresholds;
    private lastCacheUpdate;
    private readonly cacheTimeout;
    constructor();
    getThresholdForLevel(level: number): Promise<number>;
    getNextLevelThreshold(currentLevel: number): Promise<number>;
    getLevelForXp(totalXp: number): Promise<number>;
    getBadgeForLevel(level: number): Promise<string | undefined>;
    getAllThresholds(): Promise<XpThresholdConfig[]>;
    updateThreshold(level: number, xpRequired: number, badgeUnlocked?: string): Promise<void>;
    createBulkThresholds(thresholds: Omit<XpThresholdConfig, 'id'>[]): Promise<void>;
    deactivateThreshold(level: number): Promise<void>;
    validateThresholds(): Promise<{
        isValid: boolean;
        errors: string[];
    }>;
    private refreshCacheIfNeeded;
    private loadThresholdsFromDatabase;
    private initializeCache;
    exportThresholds(): Promise<XpThresholdConfig[]>;
    importThresholds(thresholds: XpThresholdConfig[]): Promise<void>;
    private validateImportedThresholds;
    private clearAllThresholds;
}
