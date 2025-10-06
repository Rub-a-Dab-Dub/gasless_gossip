export declare class TrackFeatureUsageDto {
    userId: string;
    featureName: string;
    timezone?: string;
    sessionId?: string;
    durationSeconds?: number;
    isNewUser?: boolean;
    metadata?: Record<string, any>;
}
