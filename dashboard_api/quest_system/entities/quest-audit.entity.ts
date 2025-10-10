import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('quest_audits')
@Index(['userId', 'questId', 'createdAt'])
export class QuestAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  questId: string;

  @Column()
  action: string; // 'progress', 'completed', 'reward_claimed'

  @Column('int')
  progressBefore: number;

  @Column('int')
  progressAfter: number;

  @Column('jsonb', { nullable: true })
  metadata: any;

  @Column('inet', { nullable: true })
  ipAddress: string;

  @CreateDateColumn()
  createdAt: Date;
}