import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index
} from 'typeorm';

@Entity('ip_logs')
@Index(['ipHash'])
@Index(['timestamp'])
@Index(['walletAddress'])
export class IpLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64 })
  ipHash: string;

  @Column()
  walletAddress: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  timestamp: Date;

  @Column({ type: 'varchar', length: 50 })
  action: string; // LOGIN, TRANSACTION, MESSAGE, etc.

  @Column({ type: 'boolean', default: false })
  flaggedSuspicious: boolean;
}