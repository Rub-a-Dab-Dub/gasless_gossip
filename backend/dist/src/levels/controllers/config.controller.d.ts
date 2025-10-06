import type { DynamicXpThresholdsService } from '../config/dynamic-xp-thresholds.service';
import type { XpThresholdConfig } from '../config/xp-thresholds.config';
export declare class UpdateThresholdDto {
    xpRequired: number;
    badgeUnlocked?: string;
}
export declare class BulkThresholdsDto {
    thresholds: XpThresholdConfig[];
}
export declare class ConfigController {
    private readonly dynamicXpThresholdsService;
    constructor(dynamicXpThresholdsService: DynamicXpThresholdsService);
    getAllThresholds(): Promise<XpThresholdConfig[]>;
    getThresholdForLevel(level: number): Promise<{
        level: number;
        xpRequired: number;
        badgeUnlocked?: string;
    }>;
    updateThreshold(level: number, updateDto: UpdateThresholdDto): Promise<{
        message: string;
    }>;
    createBulkThresholds(bulkDto: BulkThresholdsDto): Promise<{
        message: string;
        count: number;
    }>;
    deactivateThreshold(level: number): Promise<{
        message: string;
    }>;
    validateThresholds(): Promise<{
        isValid: boolean;
        errors: string[];
    }>;
    exportThresholds(): Promise<XpThresholdConfig[]>;
    importThresholds(importDto: BulkThresholdsDto): Promise<{
        message: string;
        count: number;
    }>;
    previewLevel(totalXp: number): Promise<{
        totalXp: number;
        level: number;
        currentXp: number;
        xpToNextLevel: number;
        progressPercentage: number;
    }>;
}
