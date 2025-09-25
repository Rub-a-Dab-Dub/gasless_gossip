import { IsString, IsNumber, IsOptional, Min, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionRequestDto {
  @ApiProperty({ 
    description: 'Recipient Stellar public key',
    example: 'GALPCCZN4YXA3YMJHKLGSHTPHQJ3L3X5D2J4QZJXK7N6VQZ3Y4I5L6M7N8O9P'
  })
  @IsString()
  @Matches(/^G[0-9A-Z]{55}$/, { 
    message: 'Invalid Stellar public key format' 
  })
  toAddress!: string;

  @ApiProperty({ 
    description: 'Amount to send',
    example: 10.5
  })
  @IsNumber()
  @Min(0.0000001, { message: 'Amount must be greater than 0' })
  amount!: number;

  @ApiProperty({ 
    description: 'Asset code (default: XLM)',
    example: 'XLM',
    required: false
  })
  @IsOptional()
  @IsString()
  assetCode?: string = 'XLM';

  @ApiProperty({ 
    description: 'Transaction memo',
    example: 'Payment for Whisper service',
    required: false
  })
  @IsOptional()
  @IsString()
  memo?: string;
}
