import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('wallet_balances')
@Index(['userId', 'network', 'createdAt'])
@Index(['userId', 'asset', 'createdAt'])
@Index(['network', 'asset', 'createdAt'])
@Index(['userId', 'network', 'asset'])
export class WalletBalance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 50 })
  network!: string; // 'base', 'stellar', 'ethereum'

  @Column({ type: 'varchar', length: 100 })
  asset!: string; // 'ETH', 'XLM', 'USDC', 'USDT', etc.

  @Column({ type: 'varchar', length: 255, nullable: true })
  contractAddress?: string; // For ERC-20 tokens

  @Column({ type: 'decimal', precision: 36, scale: 18 })
  balance!: string; // Raw balance (wei for ETH, stroops for XLM)

  @Column({ type: 'decimal', precision: 36, scale: 18 })
  formattedBalance!: string; // Human-readable balance

  @Column({ type: 'varchar', length: 10, nullable: true })
  symbol?: string; // 'ETH', 'XLM', 'USDC'

  @Column({ type: 'int', nullable: true })
  decimals?: number; // Token decimals

  @Column({ type: 'varchar', length: 100, nullable: true })
  assetType?: string; // 'native', 'token', 'nft'

  @Column({ type: 'varchar', length: 255, nullable: true })
  walletAddress?: string; // User's wallet address

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  usdValue?: string; // USD value of the balance

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  priceUsd?: string; // Price per unit in USD

  @Column({ type: 'varchar', length: 20, nullable: true })
  priceSource?: string; // 'coingecko', 'coinmarketcap', 'manual'

  @Column({ type: 'boolean', default: false })
  isStaking!: boolean; // Whether asset is staked

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  stakingRewards?: string; // Staking rewards if applicable

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    lastUpdated?: string;
    blockNumber?: string;
    transactionHash?: string;
    gasUsed?: string;
    gasPrice?: string;
    networkFee?: string;
    confirmationCount?: number;
    isTestnet?: boolean;
    explorerUrl?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  tokenInfo?: {
    name?: string;
    symbol?: string;
    decimals?: number;
    totalSupply?: string;
    contractAddress?: string;
    logoUrl?: string;
    website?: string;
    description?: string;
  };

  @Column({ type: 'timestamptz', nullable: true })
  lastFetchedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
