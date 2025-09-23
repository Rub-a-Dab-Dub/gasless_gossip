import { IsNotEmpty, IsNumber, IsString, IsUrl, IsOptional, Min, Max, IsUUID } from 'class-validator';

export class CreateBlurredAvatarDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Blur level must be at least 1' })
  @Max(10, { message: 'Blur level cannot exceed 10' })
  blurLevel?: number = 5;

  @IsNotEmpty()
  @IsString()
  @IsUrl({}, { message: 'Must be a valid URL' })
  originalImageUrl: string;
}
