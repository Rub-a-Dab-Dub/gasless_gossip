import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('rate_limit_violations')
@Index(['userId', 'createdAt'])
@Index(['endpoint', 'createdAt'])
@Index(['ipAddress', 'createdAt'])
@Index(['violationType', 'createdAt'])
export class RateLimitViolation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'varchar', length: 45 })
  ipAddress!: string;

  @Column({ type: 'varchar', length: 255 })
  endpoint!: string;

  @Column({ 
    type: 'enum', 
    enum: ['short', 'medium', 'long', 'custom'],
    default: 'short'
  })
  violationType!: 'short' | 'medium' | 'long' | 'custom';

  @Column({ type: 'int' })
  requestCount!: number;

  @Column({ type: 'int' })
  limit!: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  userAgent?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status!: string; // 'active', 'resolved', 'ignored'

  @CreateDateColumn()
  createdAt!: Date;
}
