import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index
} from 'typeorm';
import { EvasionEvidence } from './evasion-evidence.entity';
import { Appeal } from './appeal.entity';

export enum BanStatus {
  ACTIVE = 'ACTIVE',
  LIFTED = 'LIFTED',
  EXPIRED = 'EXPIRED'
}

@Entity('ban_records')
@Index(['walletAddress'])
@Index(['ipHash'])
@Index(['status'])
export class BanRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  walletAddress: string;

  @Column({ type: 'varchar', length: 64 })
  ipHash: string;

  @Column({
    type: 'enum',
    enum: BanStatus,
    default: BanStatus.ACTIVE
  })
  status: BanStatus;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'int', default: 0 })
  evidenceCount: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expiresAt: Date;

  @OneToMany(() => EvasionEvidence, evidence => evidence.banRecord)
  evidence: EvasionEvidence[];

  @OneToMany(() => Appeal, appeal => appeal.banRecord)
  appeals: Appeal[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}