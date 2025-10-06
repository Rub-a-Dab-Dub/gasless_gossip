export declare class CreateQuestCompletionDto {
    userId: string;
    questId: string;
    questName: string;
    rewardAmount: number;
    rewardType: string;
    completedAt: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
