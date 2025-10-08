import { IsString, IsNumber, IsEnum, Min, IsOptional, IsArray } from 'class-validator';

export enum DropFrequency {
  WEEKLY = 'weekly',
  DAILY = 'daily',
  MONTHLY = 'monthly',
}

export class CreateRewardConfigDto {
  @IsString()
  name: string;

  @IsString()
  tokenAddress: string;

  @IsNumber()
  @Min(1)
  topWinnersCount: number;

  @IsNumber()
  @Min(0)
  rewardAmount: number;

  @IsNumber()
  @Min(0)
  maxValueCap: number;

  @IsEnum(DropFrequency)
  frequency: DropFrequency;

  @IsString()
  cronExpression: string; // e.g., '0 0 * * 0' for weekly Sunday midnight

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  eligibilityCriteria?: string[];
}