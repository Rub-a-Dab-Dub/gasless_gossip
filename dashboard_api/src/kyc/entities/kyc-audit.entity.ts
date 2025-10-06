import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Kyc, KycStatus } from './kyc.entity';

export enum AuditAction {
  CREATED = 'created',
  STATUS_CHANGED = 'status_changed',
  DOCUMENT_UPLOADED = 'document_uploaded',
  VERIFIED_ON_CHAIN = 'verified_on_chain',
  FLAGGED = 'flagged',
  BULK_UPDATED = 'bulk_updated'
}

@Entity('kyc_audits')
export class KycAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  kycId: string;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column({ type: 'enum', enum: KycStatus, nullable: true })
  oldStatus: KycStatus;

  @Column({ type: 'enum', enum: KycStatus, nullable: true })
  newStatus: KycStatus;

  @Column()
  performedBy: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Kyc, kyc => kyc.audits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'kycId' })
  kyc: Kyc;
}