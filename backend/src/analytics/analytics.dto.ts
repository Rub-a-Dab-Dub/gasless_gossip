import { IsOptional, IsEnum, IsDateString, IsUUID, IsNumber, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MetricType } from './analytics.entity';

export class AnalyticsQueryDto {
  @ApiProperty({ enum: MetricType, required: false })
  @IsOptional()
  @IsEnum(MetricType)
  metricType?: MetricType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false, minimum: 1, maximum: 100, default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @ApiProperty({ required: false, minimum: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @ApiProperty({ required: false, enum: ['day', 'week', 'month'] })
  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase())
  groupBy?: 'day' | 'week' | 'month';
}

export class CreateAnalyticDto {
  @ApiProperty({ enum: MetricType })
  @IsEnum(MetricType)
  metricType: MetricType;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  roomId?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  value?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class AnalyticsResponseDto {
  @ApiProperty()
  totalMetrics: number;

  @ApiProperty()
  data: any[];

  @ApiProperty()
  aggregations: {
    totalVisits: number;
    totalTips: number;
    totalReactions: number;
    totalValue: number;
  };

  @ApiProperty()
  timeRange: {
    startDate: string;
    endDate: string;
  };
}