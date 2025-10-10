import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index
} from 'typeorm';
import { BanRecord } from './ban-record.entity';

export enum AppealStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

@Entity('appeals')
@Index(['status'])
@Index(['submittedAt'])
export class Appeal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BanRecord, banRecord => banRecord.appeals)
  banRecord: BanRecord;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'jsonb', nullable: true })
  evidence: Record<string, any>;

  @Column({
    type: 'enum',
    enum: AppealStatus,
    default: AppealStatus.PENDING
  })
  status: AppealStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  submittedAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  processedAt: Date;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;
}