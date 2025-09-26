import { IsEnum, IsString, IsOptional, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WalletType } from '../entities/wallet-connection.entity';

export class ConnectWalletDto {
  @ApiProperty({ 
    description: 'Type of wallet to connect',
    enum: WalletType,
    example: WalletType.ALBEDO
  })
  @IsEnum(WalletType)
  walletType!: WalletType;

  @ApiProperty({ 
    description: 'Stellar public key address',
    example: 'GALPCCZN4YXA3YMJHKLGSHTPHQJ3L3X5D2J4QZJXK7N6VQZ3Y4I5L6M7N8O9P'
  })
  @IsString()
  @Matches(/^G[0-9A-Z]{55}$/, { 
    message: 'Invalid Stellar public key format' 
  })
  address!: string;

  @ApiProperty({ 
    description: 'Public key for verification',
    required: false,
    example: 'GALPCCZN4YXA3YMJHKLGSHTPHQJ3L3X5D2J4QZJXK7N6VQZ3Y4I5L6M7N8O9P'
  })
  @IsOptional()
  @IsString()
  @Matches(/^G[0-9A-Z]{55}$/, { 
    message: 'Invalid Stellar public key format' 
  })
  publicKey?: string;

  @ApiProperty({ 
    description: 'Signature for wallet verification',
    required: false,
    example: 'base64-encoded-signature'
  })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  signature?: string;

  @ApiProperty({ 
    description: 'Additional wallet metadata',
    required: false,
    example: { deviceInfo: 'mobile', version: '1.0.0' }
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
