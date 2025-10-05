import { IsNumber, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class UpdateRoiCalcDto {
  @IsOptional()
  @IsNumber()
  totalWagered?: number;

  @IsOptional()
  @IsNumber()
  totalReturned?: number;

  @IsOptional()
  @IsNumber()
  winningBets?: number;

  @IsOptional()
  @IsNumber()
  losingBets?: number;

  @IsOptional()
  @IsBoolean()
  isAnomaly?: boolean;

  @IsOptional()
  @IsObject()
  outcomeDistribution?: Record<string, any>;
}