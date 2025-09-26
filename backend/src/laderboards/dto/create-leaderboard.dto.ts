import { IsEnum, IsUUID, IsInt, Min } from 'class-validator';
import { RankType } from '../entities/leaderboard.entity';

export class CreateLeaderboardDto {
  @IsEnum(RankType)
  rankType: RankType;

  @IsUUID()
  userId: string;

  @IsInt()
  @Min(0)
  score: number;
}

