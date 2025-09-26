import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSecretDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  content: string;
}