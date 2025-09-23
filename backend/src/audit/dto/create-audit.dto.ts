/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateAuditLogDto {
@IsNotEmpty()
     @IsString()
     userId!: string;

  @IsNotEmpty()
  @IsString()
  action: string | undefined;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}
