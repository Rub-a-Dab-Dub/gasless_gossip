import { IsString, IsInt, IsEnum, IsBoolean, IsOptional, Min, IsDateString } from 'class-validator';

export class CreateQuestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(QuestType)
  type: QuestType;

  @IsString()
  taskDescription: string;

  @IsInt()
  @Min(1)
  targetCount: number;

  @IsString()
  taskType: string;

  @IsEnum(RewardType)
  rewardType: RewardType;

  @IsInt()
  @Min(0)
  rewardAmount: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  bonusTokens?: number;

  @IsBoolean()
  @IsOptional()
  supportsStreak?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  streakBonusXp?: number;

  @IsBoolean()
  @IsOptional()
  allowsFrenzyBoost?: boolean;

  @IsString()
  @IsOptional()
  resetTime?: string;

  @IsDateString()
  @IsOptional()
  startsAt?: Date;

  @IsDateString()
  @IsOptional()
  endsAt?: Date;
}
