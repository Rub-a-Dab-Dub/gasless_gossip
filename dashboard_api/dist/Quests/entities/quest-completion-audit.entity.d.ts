export declare class QuestCompletionAudit {
    id: string;
    userId: string;
    questId: string;
    progressId: string;
    progressSnapshot: number;
    streakSnapshot: number;
    multiplierApplied: number;
    xpAwarded: number;
    tokensAwarded: number;
    metadata: Record<string, any>;
    completedAt: Date;
    userProgress: UserQuestProgress;
}
