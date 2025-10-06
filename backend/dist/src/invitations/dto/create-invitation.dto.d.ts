export declare enum InvitationDuration {
    ONE_HOUR = "1h",
    SIX_HOURS = "6h",
    ONE_DAY = "1d",
    THREE_DAYS = "3d",
    ONE_WEEK = "7d",
    ONE_MONTH = "30d",
    CUSTOM = "custom"
}
export declare class CreateInvitationDto {
    roomId: string;
    message?: string;
    duration?: InvitationDuration;
    customExpiry?: string;
    maxUsage?: number;
    metadata?: Record<string, any>;
}
