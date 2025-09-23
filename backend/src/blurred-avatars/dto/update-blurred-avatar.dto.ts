import { PartialType } from '@nestjs/mapped-types';
import { CreateBlurredAvatarDto } from './create-blurred-avatar.dto';
import { IsOptional, IsNumber, Min, Max, IsBoolean } from 'class-validator';

export class UpdateBlurredAvatarDto extends PartialType(CreateBlurredAvatarDto) {
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Blur level must be at least 1' })
  @Max(10, { message: 'Blur level cannot exceed 10' })
  blurLevel?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
