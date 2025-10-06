export class ApplyFrenzyBoostDto {
  @IsString()
  userId: string;

  @IsString()
  questId: string;

  @IsNumber()
  @Min(1)
  multiplier: number;

  @IsDateString()
  expiresAt: Date;
}
