import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { KycAudit } from './kyc-audit.entity';

export enum KycStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FLAGGED = 'flagged'
}

export enum VerificationLevel {
  NONE = 0,
  BASIC = 1,
  ADVANCED = 2,
  PREMIUM = 3
}

@Entity('kyc_records')
export class Kyc {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ type: 'enum', enum: KycStatus, default: KycStatus.PENDING })
  status: KycStatus;

  @Column({ type: 'enum', enum: VerificationLevel, default: VerificationLevel.NONE })
  verificationLevel: VerificationLevel;

  @Column({ type: 'json', nullable: true })
  documents: {
    type: string;
    url: string;
    hash: string;
    uploadedAt: string;
  }[];

  @Column({ nullable: true })
  blockchainProof: string;

  @Column({ nullable: true })
  onChainTxHash: string;

  @Column({ type: 'boolean', default: false })
  isVerifiedOnChain: boolean;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ nullable: true })
  reviewedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => KycAudit, audit => audit.kyc, { cascade: true })
  audits: KycAudit[];
}