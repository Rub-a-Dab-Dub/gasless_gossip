import { ApiProperty } from '@nestjs/swagger';
import { WalletType, ConnectionStatus } from '../entities/wallet-connection.entity';

export class WalletResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ enum: WalletType })
  walletType!: WalletType;

  @ApiProperty()
  address!: string;

  @ApiProperty({ enum: ConnectionStatus })
  status!: ConnectionStatus;

  @ApiProperty({ required: false })
  publicKey?: string;

  @ApiProperty({ required: false })
  metadata?: Record<string, any>;

  @ApiProperty()
  lastUsedAt?: Date;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class WalletStatsDto {
  @ApiProperty()
  totalWallets!: number;

  @ApiProperty()
  activeWallets!: number;

  @ApiProperty()
  walletTypes!: Record<WalletType, number>;

  @ApiProperty()
  lastConnectedAt?: Date;
}
