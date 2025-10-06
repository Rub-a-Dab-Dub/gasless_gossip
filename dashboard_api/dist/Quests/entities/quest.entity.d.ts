import { QuestType, QuestStatus, RewardType } from '../enums/quest.enums';
export declare class Quest {
    id: string;
    title: string;
    description: string;
    type: QuestType;
    status: QuestStatus;
    taskDescription: string;
    targetCount: number;
    taskType: string;
    rewardType: RewardType;
    rewardAmount: number;
    bonusTokens: number;
    supportsStreak: boolean;
    streakBonusXp: number;
    allowsFrenzyBoost: boolean;
    resetTime: string;
    startsAt: Date;
    endsAt: Date;
    createdAt: Date;
    updatedAt: Date;
    userProgress: UserQuestProgress[];
}
