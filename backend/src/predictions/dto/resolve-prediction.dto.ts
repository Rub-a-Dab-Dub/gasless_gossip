import { IsUUID, IsNotEmpty, IsBoolean } from 'class-validator';

export class ResolvePredictionDto {
  @IsUUID()
  @IsNotEmpty()
  predictionId!: string;

  @IsBoolean()
  @IsNotEmpty()
  isCorrect!: boolean;
}
