import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('token_gifts')
@Index(['senderId', 'createdAt'])
@Index(['recipientId', 'createdAt'])
@Index(['status', 'createdAt'])
@Index(['network', 'createdAt'])
export class TokenGift {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  senderId!: string;

  @Column({ type: 'uuid' })
  recipientId!: string;

  @Column({ type: 'varchar', length: 100 })
  tokenAddress!: string; // Stellar asset contract address

  @Column({ type: 'varchar', length: 50 })
  tokenSymbol!: string; // e.g., USDC, XLM

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  amount!: string;

  @Column({ type: 'varchar', length: 20 })
  network!: string; // 'stellar', 'base', 'ethereum'

  @Column({ 
    type: 'enum', 
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  })
  status!: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

  @Column({ type: 'varchar', length: 255, nullable: true })
  stellarTxHash?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  baseTxHash?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymasterTxHash?: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  gasUsed?: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  gasPrice?: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  totalCost?: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  sorobanData?: Record<string, any>; // Soroban contract interaction data

  @Column({ type: 'jsonb', nullable: true })
  paymasterData?: Record<string, any>; // Base paymaster data

  @Column({ type: 'timestamptz', nullable: true })
  processedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
