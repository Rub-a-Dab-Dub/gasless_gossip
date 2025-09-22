export class LevelResponseDto {
  id!: string;
  userId!: string;
  level!: number;
  currentXp!: number;
  xpThreshold!: number;
  totalXp!: number;
  isLevelUpPending!: boolean;
  xpToNextLevel!: number;
  progressPercentage!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class LevelUpEventDto {
  userId!: string;
  previousLevel!: number;
  newLevel!: number;
  totalXp!: number;
  badgesUnlocked?: string[];
  timestamp!: Date;
}
