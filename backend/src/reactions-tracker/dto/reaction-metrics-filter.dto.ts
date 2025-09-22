import { IsOptional, IsDateString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  LAUGH = 'laugh',
  ANGRY = 'angry',
  SAD = 'sad',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class ReactionMetricsFilterDto {
  @ApiPropertyOptional({ description: 'Filter by date from' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Filter by date to' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ enum: ReactionType, description: 'Filter by reaction type' })
  @IsOptional()
  @IsEnum(ReactionType)
  reactionType?: ReactionType;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ minimum: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}

// dto/reaction-track-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ReactionTrackResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  messageId: string;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  likeCount: number;

  @ApiProperty()
  loveCount: number;

  @ApiProperty()
  laughCount: number;

  @ApiProperty()
  angryCount: number;

  @ApiProperty()
  sadCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class MostReactedSecretsResponseDto {
  @ApiProperty({ type: [ReactionTrackResponseDto] })
  data: ReactionTrackResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}

// dto/reaction-update.dto.ts
import { IsEnum, IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReactionUpdateDto {
  @ApiProperty()
  @IsUUID()
  messageId: string;

  @ApiProperty({ enum: ReactionType })
  @IsEnum(ReactionType)
  reactionType: ReactionType;

  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  count: number = 1;
}
