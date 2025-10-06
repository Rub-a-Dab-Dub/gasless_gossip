export declare class UserQuestProgress {
    id: string;
    userId: string;
    questId: string;
    currentProgress: number;
    targetCount: number;
    completed: boolean;
    completedAt: Date;
    currentStreak: number;
    longestStreak: number;
    lastCompletionDate: Date;
    activeMultiplier: number;
    multiplierExpiresAt: Date;
    lastResetAt: Date;
    createdAt: Date;
    updatedAt: Date;
    quest: Quest;
    completionAudits: QuestCompletionAudit[];
}
