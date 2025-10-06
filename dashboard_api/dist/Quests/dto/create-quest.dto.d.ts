export declare class CreateQuestDto {
    title: string;
    description: string;
    type: QuestType;
    taskDescription: string;
    targetCount: number;
    taskType: string;
    rewardType: RewardType;
    rewardAmount: number;
    bonusTokens?: number;
    supportsStreak?: boolean;
    streakBonusXp?: number;
    allowsFrenzyBoost?: boolean;
    resetTime?: string;
    startsAt?: Date;
    endsAt?: Date;
}
