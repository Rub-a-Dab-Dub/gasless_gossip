import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ReportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ReportFormat {
  JSON = 'json',
  CSV = 'csv',
}

@Entity('bulk_reports')
export class BulkReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  adminId: string;

  @Column({ type: 'simple-array' })
  resources: string[];

  @Column({ type: 'json' })
  filters: Record<string, any>;

  @Column({ type: 'enum', enum: ReportFormat, default: ReportFormat.JSON })
  format: ReportFormat;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Column({ type: 'int', default: 0 })
  progress: number;

  @Column({ type: 'bigint', default: 0 })
  fileSizeBytes: number;

  @Column({ nullable: true })
  downloadUrl: string;

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}