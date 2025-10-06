import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { KycStatus, VerificationLevel } from '../entities/kyc.entity';

export class UpdateKycStatusDto {
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
  rejectionReason?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}