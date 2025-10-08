import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('bulk_action_history')
export class BulkActionHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: BulkActionType })
  action: BulkActionType;

  @Column('simple-array')
  userIds: string[];

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'int' })
  successful: number;

  @Column({ type: 'int' })
  failed: number;

  @Column('jsonb', { nullable: true })
  errors: Array<{ userId: string; error: string }>;

  @Column({ type: 'int' })
  executionTime: number;

  @Column({ default: false })
  dryRun: boolean;

  @Column({ type: 'uuid' })
  executedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}