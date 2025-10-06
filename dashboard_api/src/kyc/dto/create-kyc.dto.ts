import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { KycStatus, VerificationLevel } from '../entities/kyc.entity';

export class CreateKycDto {
  @ApiProperty({ example: 'user-123' })
  @IsString()
  userId: string;

  @ApiProperty({ enum: KycStatus, default: KycStatus.PENDING })
  @IsOptional()
  @IsEnum(KycStatus)
  status?: KycStatus;

  @ApiProperty({ enum: VerificationLevel, default: VerificationLevel.BASIC })
  @IsOptional()
  @IsEnum(VerificationLevel)
  verificationLevel?: VerificationLevel;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}