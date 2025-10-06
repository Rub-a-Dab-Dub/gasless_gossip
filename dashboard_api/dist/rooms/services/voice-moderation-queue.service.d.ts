export interface VoiceModerationItem {
    id: string;
    roomId: string;
    userId: string;
    voiceNoteUrl: string;
    content?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'processing' | 'approved' | 'rejected';
    submittedAt: Date;
    processedAt?: Date;
    moderatorId?: string;
    reason?: string;
    autoModerationScore?: number;
}
export declare class VoiceModerationQueueService {
    private readonly logger;
    private readonly queue;
    private readonly maxQueueSize;
    private processingCounter;
    addToQueue(item: Omit<VoiceModerationItem, 'id' | 'submittedAt' | 'status'>): Promise<number>;
    getQueueStatus(): {
        totalItems: number;
        pendingItems: number;
        processingItems: number;
        queueCapacity: number;
        averageProcessingTime: number;
        items: VoiceModerationItem[];
    };
    processItem(itemId: string, moderatorId: string, decision: 'approved' | 'rejected', reason?: string): Promise<void>;
    getItemsByRoom(roomId: string): VoiceModerationItem[];
    processAutoModerationQueue(): Promise<void>;
    private processAutoModeration;
    private calculateAutoModerationScore;
    private findInsertPosition;
    private generateId;
    private calculateAverageProcessingTime;
}
