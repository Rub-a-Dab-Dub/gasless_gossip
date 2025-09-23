import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateCodeDto {
  @ApiProperty({ description: 'ID of the user generating the referral code' })
  @IsUUID()
  userId: string;
}

// src/referrals/interfaces/stellar.interface.ts
export interface StellarRewardConfig {
  baseReward: number;
  assetCode: string;
  issuerPublicKey: string;
  distributorSecretKey: string;
}

export interface StellarTransactionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}