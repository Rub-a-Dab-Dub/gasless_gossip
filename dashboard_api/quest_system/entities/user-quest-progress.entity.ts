import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, Unique } from 'typeorm';
import { Quest } from './quest.entity';

@Entity('user_quest_progress')
@Unique(['userId', 'questId', 'periodDate'])
@Index(['userId', 'questId'])
@Index(['periodDate'])
export class UserQuestProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  questId: string;

  @ManyToOne(() => Quest, quest => quest.userProgress)
  quest: Quest;

  @Column('int', { default: 0 })
  currentCount: number;

  @Column('boolean', { default: false })
  completed: boolean;

  @Column('date')
  periodDate: Date; // For daily/weekly tracking

  @Column('int', { default: 0 })
  currentStreak: number;

  @Column('int', { default: 0 })
  longestStreak: number;

  @Column('timestamp', { nullable: true })
  lastCompletedAt: Date;

  @Column('timestamp', { nullable: true })
  completedAt: Date;

  @Column('int', { default: 0 })
  xpEarned: number;

  @Column('int', { default: 0 })
  tokensEarned: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}