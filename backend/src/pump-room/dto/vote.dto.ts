
import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';

export class VoteDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  predictionId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  confidence: number; // 1-100 confidence level

  @IsOptional()
  @IsString()
  stellarAddress?: string;
}
