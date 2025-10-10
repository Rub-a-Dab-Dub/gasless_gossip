import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from 'typeorm';

@Entity('wallet_blacklist')
@Index(['walletAddress'], { unique: true })
@Index(['status'])
export class WalletBlacklist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  walletAddress: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastDetectionAt: Date;

  @Column({ type: 'int', default: 0 })
  detectionCount: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}