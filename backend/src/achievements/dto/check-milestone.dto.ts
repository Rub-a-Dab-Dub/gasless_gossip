import { IsEnum, IsUUID, IsNumber, Min } from 'class-validator';
import { AchievementType } from '../entities/achievement.entity';

export class CheckMilestoneDto {
  @IsUUID()
  userId!: string;

  @IsEnum(AchievementType)
  type!: AchievementType;

  @IsNumber()
  @Min(0)
  currentValue!: number;
}
