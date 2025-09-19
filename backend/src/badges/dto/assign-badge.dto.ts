import { IsInt, IsString, IsObject, IsOptional } from 'class-validator';

export class AssignBadgeDto {
  @IsInt()
  userId!: number;

  @IsString()
  type!: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
