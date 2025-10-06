export declare class QuestCompletion {
    id: string;
    userId: string;
    questId: string;
    questName: string;
    rewardAmount: number;
    rewardType: string;
    completedAt: Date;
    metadata: Record<string, any>;
    ipAddress: string;
    userAgent: string;
    isFlagged: boolean;
    isReversed: boolean;
    reverseReason: string;
    reversedBy: string;
    reversedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
