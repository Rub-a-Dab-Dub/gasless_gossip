import { PartialType } from '@nestjs/mapped-types';
import { CreateLevelDto } from './create-level.dto';
import { IsOptional, IsNumber, Min, IsBoolean } from 'class-validator';

export class UpdateLevelDto extends PartialType(CreateLevelDto) {
  @IsOptional()
  @IsNumber()
  @Min(0)
  xpToAdd?: number;

  @IsOptional()
  @IsBoolean()
  isLevelUpPending?: boolean;
}
