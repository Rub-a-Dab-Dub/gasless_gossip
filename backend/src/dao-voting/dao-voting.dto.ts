import { IsUUID, IsString, IsNumber, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum VoteChoice {
  YES = 'yes',
  NO = 'no',
  ABSTAIN = 'abstain'
}

export class CreateVoteDto {
  @IsUUID()
  proposalId: string;

  @IsUUID()
  userId: string;

  @IsEnum(VoteChoice)
  choice: VoteChoice;

  @IsNumber()
  @Min(0.00000001)
  @Max(999999999)
  @Type(() => Number)
  weight: number;

  @IsString()
  stellarAccountId: string;

  @IsOptional()
  @IsString()
  stellarTransactionHash?: string;
}

export class VotingResultDto {
  proposalId: string;
  totalVotes: number;
  totalWeight: number;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  yesWeight: number;
  noWeight: number;
  abstainWeight: number;
  participationRate: number;
  weightedApprovalRate: number;
  votes: VoteDetailDto[];
}

export class VoteDetailDto {
  id: string;
  userId: string;
  choice: string;
  weight: number;
  stellarTransactionHash: string;
  createdAt: Date;
}

export class ProposalValidationDto {
  @IsUUID()
  proposalId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  minimumVotingWeight: number;

  @IsNumber()
  @Min(1)
  votingPeriodHours: number;
}

