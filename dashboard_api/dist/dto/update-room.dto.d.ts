export declare class UpdateRoomDto {
    expiresAt?: string;
    accessRules?: Record<string, any>;
    moderatorIds?: string[];
    pinnedMessageId?: string;
    isClosed?: boolean;
}
