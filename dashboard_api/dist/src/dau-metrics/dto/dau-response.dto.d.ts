export declare class DauBreakdownDto {
    date: string;
    featureName: string;
    uniqueUsers: number;
    totalSessions: number;
    averageSessionDuration: number;
    newUsers: number;
    returningUsers: number;
    benchmarkGoal?: number;
    goalAchievement?: number;
}
export declare class HistoricalTrendDto {
    date: string;
    totalDau: number;
    changeFromPrevious: number;
    changePercentage: number;
    trend: "up" | "down" | "stable";
}
export declare class FeatureDrilldownDto {
    featureName: string;
    totalUsers: number;
    totalSessions: number;
    averageDuration: number;
    userPercentage: number;
    sessionPercentage: number;
}
export declare class AlertDropDto {
    id: string;
    alertDate: Date;
    featureName: string;
    alertType: string;
    severity: string;
    currentValue: number;
    expectedValue: number;
    dropPercentage: number;
    message: string;
    isResolved: boolean;
}
