import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('token_gift_transactions')
@Index(['giftId', 'createdAt'])
@Index(['network', 'createdAt'])
@Index(['txHash', 'network'])
export class TokenGiftTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  giftId!: string;

  @Column({ type: 'varchar', length: 20 })
  network!: string; // 'stellar', 'base', 'ethereum'

  @Column({ type: 'varchar', length: 255 })
  txHash!: string;

  @Column({ 
    type: 'enum', 
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  })
  status!: 'pending' | 'confirmed' | 'failed';

  @Column({ type: 'varchar', length: 50, nullable: true })
  blockNumber?: string;

  @Column({ type: 'int', nullable: true })
  confirmations?: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  gasUsed?: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  gasPrice?: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  effectiveGasPrice?: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  transactionFee?: string;

  @Column({ type: 'boolean', default: false })
  sponsored!: boolean; // Whether transaction was sponsored by paymaster

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymasterAddress?: string;

  @Column({ type: 'jsonb', nullable: true })
  transactionData?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  receipt?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
