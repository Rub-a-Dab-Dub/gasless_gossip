import { IsString, IsObject, IsOptional } from 'class-validator';

export class CreateAppealDto {
  @IsString()
  banRecordId: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsObject()
  evidence?: Record<string, any>;
}