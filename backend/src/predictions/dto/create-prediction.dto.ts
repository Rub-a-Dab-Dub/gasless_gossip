import { IsString, IsNotEmpty, IsDateString, IsUUID, MaxLength, MinLength, IsOptional } from 'class-validator';

export class CreatePredictionDto {
  @IsUUID()
  @IsNotEmpty()
  roomId!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(200)
  prediction!: string;

  @IsDateString()
  @IsNotEmpty()
  expiresAt!: string;
}
