export declare class CreateGrowthMetricDto {
    userId: string;
    cohortId?: string;
    metricDate: Date;
    userLevel: number;
    unlocksCount: number;
    dropOffPoint?: number;
    sessionDuration?: number;
    isActive?: boolean;
}
