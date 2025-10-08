import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsString, IsObject, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MetricsBreakdownDto {
  @ApiProperty()
  @IsObject()
  byLevel: { [key: string]: number };

  @ApiProperty()
  @IsObject()
  byFeature: { [key: string]: number };
}

class MetricsDataDto {
  @ApiProperty()
  value: number;

  @ApiProperty()
  change: number;

  @ApiProperty()
  @IsArray()
  trend: number[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => MetricsBreakdownDto)
  breakdown: MetricsBreakdownDto;
}

class CohortMetricsDto {
  @ApiProperty()
  retention: number;

  @ApiProperty()
  engagement: number;

  @ApiProperty()
  conversion: number;
}

class CohortDataDto {
  @ApiProperty()
  @IsString()
  cohortId: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CohortMetricsDto)
  metrics: CohortMetricsDto;
}

export class CreateSnapshotDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  snapshotDate: Date;

  @ApiProperty()
  @IsString()
  metricType: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => MetricsDataDto)
  metrics: MetricsDataDto;

  @ApiPropertyOptional({ type: [CohortDataDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CohortDataDto)
  cohortData?: CohortDataDto[];
}