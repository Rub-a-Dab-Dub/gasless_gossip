import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('gossip_updates')
@Index(['intentId', 'createdAt'])
@Index(['userId', 'createdAt'])
export class GossipUpdate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  intentId!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ 
    type: 'enum', 
    enum: ['new_intent', 'status_change', 'vote', 'comment', 'verification']
  })
  type!: 'new_intent' | 'status_change' | 'vote' | 'comment' | 'verification';

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;
}
