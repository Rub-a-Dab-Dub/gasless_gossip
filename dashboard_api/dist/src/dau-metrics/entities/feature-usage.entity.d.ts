export declare class FeatureUsage {
    id: string;
    userId: string;
    featureName: string;
    usageDate: Date;
    usageTimestamp: Date;
    timezone: string;
    sessionId: string;
    durationSeconds: number;
    isNewUser: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
}
