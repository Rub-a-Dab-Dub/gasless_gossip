import { IsString, IsOptional, IsNumber, IsDateString, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CohortType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export enum ChurnRiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export class CreateCohortDto {
  @ApiProperty({ description: 'Cohort name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Start date for cohort', example: '2025-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date for cohort', example: '2025-01-31' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ enum: CohortType, description: 'Cohort grouping type' })
  @IsEnum(CohortType)
  type: CohortType;

  @ApiProperty({ description: 'User segment filters', required: false })
  @IsOptional()
  filters?: Record<string, any>;
}

export class DrillDownSegmentDto {
  @ApiProperty({ description: 'Segment filters to apply' })
  @IsOptional()
  filters?: Record<string, any>;

  @ApiProperty({ description: 'Feature to analyze', required: false })
  @IsOptional()
  @IsString()
  feature?: string;

  @ApiProperty({ description: 'Minimum retention percentage', required: false })
  @IsOptional()
  @IsNumber()
  minRetention?: number;
}

export class PredictChurnDto {
  @ApiProperty({ description: 'User IDs to predict churn for', required: false })
  @IsOptional()
  @IsArray()
  userIds?: string[];

  @ApiProperty({ description: 'Prediction time window in days', default: 30 })
  @IsOptional()
  @IsNumber()
  daysAhead?: number;

  @ApiProperty({ description: 'Minimum risk level to return', required: false })
  @IsOptional()
  @IsEnum(ChurnRiskLevel)
  minRiskLevel?: ChurnRiskLevel;
}
