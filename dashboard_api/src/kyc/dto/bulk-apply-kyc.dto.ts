import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsEnum, IsOptional } from 'class-validator';
import { KycStatus, VerificationLevel } from '../entities/kyc.entity';

export class BulkApplyKycDto {
  @ApiProperty({ type: [String], example: ['user-1', 'user-2', 'user-3'] })
  @IsArray()
  @IsString({ each: true })
  userIds: string[];

  @ApiProperty({ enum: KycStatus })
  @IsEnum(KycStatus)
  status: KycStatus;

  @ApiProperty({ enum: VerificationLevel, required: false })
  @IsOptional()
  @IsEnum(VerificationLevel)
  verificationLevel?: VerificationLevel;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}