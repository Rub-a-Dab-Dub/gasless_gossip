import { IsString, IsEnum, IsInt, IsNumber, IsBoolean, IsOptional, Min, IsDateString } from 'class-validator';
import { QuestType } from '../entities/quest.entity';

export class CreateQuestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(QuestType)
  type: QuestType;

  @IsInt()
  @Min(1)
  requiredCount: number;

  @IsInt()
  @Min(0)
  xpReward: number;

  @IsInt()
  @Min(0)
  tokenReward: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  frenzyMultiplier?: number;

  @IsBoolean()
  @IsOptional()
  enableStreaks?: boolean;

  @IsInt()
  @IsOptional()
  @Min(0)
  streakBonusXp?: number;

  @IsDateString()
  @IsOptional()
  endsAt?: string;
}
