import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum ReportStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed'
}

export enum ReportType {
  HARASSMENT = 'harassment',
  SPAM = 'spam',
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  HATE_SPEECH = 'hate_speech',
  SCAM = 'scam',
  OTHER = 'other'
}

@Entity('reports')
@Index(['reportedUserId'])
@Index(['reporterId'])
@Index(['status'])
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  reporterId: string;

  @Column('uuid')
  reportedUserId: string;

  @Column('enum', { enum: ReportType })
  type: ReportType;

  @Column('text')
  reason: string;

  @Column('text', { nullable: true })
  evidence: string; // URLs, screenshots, etc.

  @Column('enum', { enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Column('uuid', { nullable: true })
  reviewedBy: string;

  @Column('text', { nullable: true })
  reviewNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}