export declare class AverageLevelsDto {
    date: string;
    averageLevel: number;
    totalUsers: number;
    cohortId?: string;
}
export declare class UnlockRatesDto {
    date: string;
    totalUnlocks: number;
    uniqueUsers: number;
    unlockRate: number;
    cohortId?: string;
}
export declare class DropOffAnalysisDto {
    level: number;
    dropOffCount: number;
    dropOffPercentage: number;
}
export declare class CohortAnalysisDto {
    cohortId: string;
    cohortName: string;
    totalUsers: number;
    averageLevel: number;
    totalUnlocks: number;
    retentionRate: number;
}
export declare class PlateauPredictionDto {
    plateauLevel: number;
    confidence: number;
    daysToPlateauEstimate: number;
    trend: "increasing" | "stable" | "decreasing";
}
