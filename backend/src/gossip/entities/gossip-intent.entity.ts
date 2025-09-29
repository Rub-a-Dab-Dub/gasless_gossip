import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('gossip_intents')
@Index(['roomId', 'createdAt'])
@Index(['userId', 'createdAt'])
@Index(['status', 'createdAt'])
export class GossipIntent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  roomId!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ 
    type: 'enum', 
    enum: ['pending', 'verified', 'debunked', 'expired'],
    default: 'pending'
  })
  status!: 'pending' | 'verified' | 'debunked' | 'expired';

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'int', default: 0 })
  upvotes!: number;

  @Column({ type: 'int', default: 0 })
  downvotes!: number;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
