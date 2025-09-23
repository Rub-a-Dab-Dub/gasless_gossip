/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from 'class-validator';

export class FilterAuditLogDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  action?: string;
}
