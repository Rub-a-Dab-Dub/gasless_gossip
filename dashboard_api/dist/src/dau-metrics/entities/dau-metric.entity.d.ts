export declare class DauMetric {
    id: string;
    metricDate: Date;
    timezone: string;
    featureName: string;
    uniqueUsers: number;
    totalSessions: number;
    totalDurationSeconds: number;
    newUsers: number;
    returningUsers: number;
    benchmarkGoal: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
