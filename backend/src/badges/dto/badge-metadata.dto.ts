import { IsString, IsOptional, IsObject } from 'class-validator';

export class BadgeMetadataDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  extra?: Record<string, any>;
}
