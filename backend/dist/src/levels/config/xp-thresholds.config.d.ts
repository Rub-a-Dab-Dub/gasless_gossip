export interface XpThresholdConfig {
    level: number;
    xpRequired: number;
    badgeUnlocked?: string;
}
export declare const DEFAULT_XP_THRESHOLDS: XpThresholdConfig[];
export declare class XpThresholdsConfig {
    static getThresholdForLevel(level: number): number;
    static getNextLevelThreshold(currentLevel: number): number;
    static getLevelForXp(totalXp: number): number;
    static getBadgeForLevel(level: number): string | undefined;
    static getAllThresholds(): XpThresholdConfig[];
}
