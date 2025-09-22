import { IsEnum, IsUUID, IsOptional, IsNumber, Min } from 'class-validator';
import { AchievementType, AchievementTier } from '../entities/achievement.entity';

export class AwardAchievementDto {
  @IsUUID()
  userId!: string;

  @IsEnum(AchievementType)
  type!: AchievementType;

  @IsOptional()
  @IsEnum(AchievementTier)
  tier?: AchievementTier;

  @IsNumber()
  @Min(1)
  milestoneValue!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rewardAmount?: number;
}
