import { IsEnum, IsString, IsOptional, IsUUID, IsObject, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ContentType, Platform } from '../entities/share.entity';

export class CreateShareDto {
  @IsEnum(ContentType)
  contentType!: ContentType;

  @IsOptional()
  @IsUUID()
  contentId?: string;

  @IsEnum(Platform)
  platform!: Platform;

  @IsOptional()
  @IsString()
  shareText?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ShareResponseDto {
  @IsString()
  id!: string;

  @IsString()
  userId!: string;

  @IsEnum(ContentType)
  contentType!: ContentType;

  @IsOptional()
  @IsString()
  contentId?: string;

  @IsEnum(Platform)
  platform!: Platform;

  @IsOptional()
  @IsString()
  shareUrl?: string;

  @IsOptional()
  @IsString()
  externalUrl?: string;

  @IsOptional()
  @IsString()
  shareText?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  xpAwarded!: number;

  @IsOptional()
  @IsString()
  stellarTxId?: string;

  @IsBoolean()
  isSuccessful!: boolean;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsString()
  createdAt!: Date;

  @IsString()
  updatedAt!: Date;
}
