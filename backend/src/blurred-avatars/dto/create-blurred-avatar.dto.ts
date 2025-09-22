import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateBlurredAvatarDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  blurLevel: number;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
