import { IsString, IsUUID, IsNumber, IsEnum, IsOptional, IsDecimal, Min, Max, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTokenGiftDto {
  @IsUUID()
  recipientId!: string;

  @IsString()
  @Length(1, 100)
  tokenAddress!: string;

  @IsString()
  @Length(1, 50)
  tokenSymbol!: string;

  @IsString()
  @Transform(({ value }) => value.toString())
  @IsDecimal({ decimal_digits: '0,8' })
  amount!: string;

  @IsEnum(['stellar', 'base', 'ethereum'])
  network!: 'stellar' | 'base' | 'ethereum';

  @IsOptional()
  @IsString()
  @Length(1, 500)
  message?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class TokenGiftDto {
  id!: string;
  senderId!: string;
  recipientId!: string;
  tokenAddress!: string;
  tokenSymbol!: string;
  amount!: string;
  network!: string;
  status!: string;
  stellarTxHash?: string;
  baseTxHash?: string;
  paymasterTxHash?: string;
  gasUsed?: string;
  gasPrice?: string;
  totalCost?: string;
  message?: string;
  metadata?: Record<string, any>;
  sorobanData?: Record<string, any>;
  paymasterData?: Record<string, any>;
  processedAt?: Date;
  completedAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}

export class TokenGiftTransactionDto {
  id!: string;
  giftId!: string;
  network!: string;
  txHash!: string;
  status!: string;
  blockNumber?: string;
  confirmations?: number;
  gasUsed?: string;
  gasPrice?: string;
  effectiveGasPrice?: string;
  transactionFee?: string;
  sponsored!: boolean;
  paymasterAddress?: string;
  transactionData?: Record<string, any>;
  receipt?: Record<string, any>;
  errorMessage?: string;
  createdAt!: Date;
}

export class TokenGiftResponseDto {
  gift!: TokenGiftDto;
  transactions!: TokenGiftTransactionDto[];
  estimatedGas?: {
    stellar: string;
    base: string;
    total: string;
  };
  paymasterStatus?: {
    available: boolean;
    sponsored: boolean;
    maxGas: string;
  };
}

export class GasEstimateDto {
  network!: string;
  gasUsed!: string;
  gasPrice!: string;
  totalCost!: string;
  sponsored!: boolean;
  paymasterCoverage?: string;
}

export class PaymasterStatusDto {
  available!: boolean;
  sponsored!: boolean;
  maxGas!: string;
  remainingBalance!: string;
  network!: string;
}
