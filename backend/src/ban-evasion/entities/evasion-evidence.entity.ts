import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index
} from 'typeorm';
import { BanRecord } from './ban-record.entity';

@Entity('evasion_evidence')
@Index(['banRecord'])
@Index(['timestamp'])
@Index(['evidenceType'])
export class EvasionEvidence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BanRecord, banRecord => banRecord.evidence)
  banRecord: BanRecord;

  @Column({ type: 'varchar', length: 50 })
  evidenceType: string; // IP_MATCH, BEHAVIOR_PATTERN, WALLET_ASSOCIATION, etc.

  @Column({ type: 'jsonb' })
  data: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.0 })
  confidence: number; // 0.0 to 1.0

  @CreateDateColumn({ type: 'timestamp with time zone' })
  timestamp: Date;
}