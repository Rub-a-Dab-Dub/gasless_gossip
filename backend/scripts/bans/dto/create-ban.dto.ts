import { IsString, IsNotEmpty, IsUUID, IsOptional, IsDateString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBanDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Ban reason must be at least 10 characters long' })
  @MaxLength(500, { message: 'Ban reason cannot exceed 500 characters' })
  @Transform(({ value }) => value?.trim())
  reason: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string; // ISO date string, omit for permanent ban

  @IsOptional()
  @IsUUID()
  bannedBy?: string;
}
