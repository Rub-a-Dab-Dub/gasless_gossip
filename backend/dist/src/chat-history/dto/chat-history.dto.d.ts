export declare class ChatHistoryQueryDto {
    roomId: string;
    limit?: number;
    page?: number;
    cursor?: string;
    before?: string;
    after?: string;
}
export declare class ChatHistoryResponseDto {
    messages: ChatMessageDto[];
    pagination: PaginationDto;
    performance: PerformanceMetricsDto;
}
export declare class ChatMessageDto {
    id: string;
    roomId: string;
    senderId: string;
    content: string;
    messageType?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
export declare class PaginationDto {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextCursor?: string;
    prevCursor?: string;
}
export declare class PerformanceMetricsDto {
    queryTimeMs: number;
    cacheHit: boolean;
    indexUsed: boolean;
}
