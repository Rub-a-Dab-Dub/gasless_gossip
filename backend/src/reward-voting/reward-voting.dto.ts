import { IsUUID, IsNumber, IsOptional } from 'class-validator';

export class CastRewardVoteDto {
  @IsUUID()
  rewardId!: string;

  @IsUUID()
  userId!: string;

  @IsNumber()
  voteWeight!: number;

  @IsOptional()
  stellarAccountId?: string;
}

export class RewardsResultsQueryDto {
  @IsUUID()
  rewardId!: string;
}

export interface RewardResultItemDto {
  userId: string;
  voteWeight: number;
  stellarTxHash?: string;
}

export interface RewardResultsDto {
  rewardId: string;
  totalWeight: number;
  votes: RewardResultItemDto[];
}


