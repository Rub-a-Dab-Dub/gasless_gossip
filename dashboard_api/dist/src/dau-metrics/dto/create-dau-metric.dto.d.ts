export declare class CreateDauMetricDto {
    metricDate: string;
    timezone?: string;
    featureName: string;
    uniqueUsers: number;
    totalSessions: number;
    totalDurationSeconds: number;
    newUsers: number;
    returningUsers: number;
    benchmarkGoal?: number;
    metadata?: Record<string, any>;
}
