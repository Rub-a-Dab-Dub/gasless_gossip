export declare enum MetricType {
    VISIT = "visit",
    TIP = "tip",
    REACTION = "reaction",
    MESSAGE = "message",
    ROOM_JOIN = "room_join",
    ROOM_LEAVE = "room_leave"
}
export declare class Analytic {
    id: string;
    metricType: MetricType;
    userId: string;
    roomId?: string;
    value: number;
    metadata?: Record<string, any>;
    createdAt: Date;
}
