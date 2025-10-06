import { IsString, IsNumber, IsInt, Min, IsOptional, IsObject } from 'class-validator';

export class CreateWinRateDto {
  @IsString()
  roomCategory: string;

  @IsNumber()
  @Min(0)
  totalWagered: number;

  @IsNumber()
  @Min(0)
  totalReturned: number;

  @IsInt()
  @Min(0)
  totalBets: number;

  @IsInt()
  @Min(0)
  winningBets: number;

  @IsInt()
  @Min(0)
  losingBets: number;

  @IsOptional()
  @IsObject()
  outcomeDistribution?: Record<string, any>;
}