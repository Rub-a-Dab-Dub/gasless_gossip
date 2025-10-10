import { IsString, IsOptional, IsDateString, IsObject } from 'class-validator';

export class CreateBanRecordDto {
  @IsString()
  walletAddress: string;

  @IsString()
  ipAddress: string; // Will be hashed by the service

  @IsString()
  reason: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsDateString()
  expiresAt?: Date;
}