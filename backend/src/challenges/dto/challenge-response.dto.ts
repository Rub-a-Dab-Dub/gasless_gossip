import { ApiProperty } from '@nestjs/swagger';
import { ChallengeStatus, ChallengeType } from '../entities/challenge.entity';
import { ParticipationStatus } from '../entities/challenge-participation.entity';

export class ChallengeResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: ChallengeType })
  type!: ChallengeType;

  @ApiProperty()
  goal!: number;

  @ApiProperty()
  reward!: number;

  @ApiProperty({ enum: ChallengeStatus })
  status!: ChallengeStatus;

  @ApiProperty()
  expiresAt!: Date;

  @ApiProperty({ required: false })
  completedAt?: Date;

  @ApiProperty({ required: false })
  createdBy?: string;

  @ApiProperty({ required: false })
  metadata?: Record<string, any>;

  @ApiProperty()
  participantCount!: number;

  @ApiProperty()
  completionCount!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class ChallengeParticipationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  challengeId!: string;

  @ApiProperty({ enum: ParticipationStatus })
  status!: ParticipationStatus;

  @ApiProperty()
  progress!: number;

  @ApiProperty()
  rewardEarned!: number;

  @ApiProperty({ required: false })
  completedAt?: Date;

  @ApiProperty({ required: false })
  progressData?: Record<string, any>;

  @ApiProperty({ required: false })
  stellarTransactionId?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class ChallengeStatsDto {
  @ApiProperty()
  totalChallenges!: number;

  @ApiProperty()
  activeChallenges!: number;

  @ApiProperty()
  completedChallenges!: number;

  @ApiProperty()
  totalRewardsEarned!: number;

  @ApiProperty()
  participationRate!: number;
}
