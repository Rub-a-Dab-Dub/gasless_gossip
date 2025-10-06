import { IsOptional, IsString, IsDateString } from 'class-validator';

export class RiskMetricsQueryDto {
  @IsOptional()
  @IsString()
  roomCategory?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}