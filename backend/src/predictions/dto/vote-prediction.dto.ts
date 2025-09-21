import { IsUUID, IsNotEmpty, IsBoolean } from 'class-validator';

export class VotePredictionDto {
  @IsUUID()
  @IsNotEmpty()
  predictionId!: string;

  @IsBoolean()
  @IsNotEmpty()
  isCorrect!: boolean;
}
