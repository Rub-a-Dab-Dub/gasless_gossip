import { IsNumber, IsPositive, IsOptional } from 'class-validator';

export class UpdateReputationDto {
  @IsNumber()
  @IsPositive()
  userId!: number;

  @IsNumber()
  @IsOptional()
  scoreChange?: number;
}