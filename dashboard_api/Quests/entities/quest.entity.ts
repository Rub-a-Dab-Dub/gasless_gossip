import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { QuestType, QuestStatus, RewardType } from '../enums/quest.enums';

@Entity('quests')
export class Quest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: QuestType,
    default: QuestType.DAILY
  })
  type: QuestType;

  @Column({
    type: 'enum',
    enum: QuestStatus,
    default: QuestStatus.ACTIVE
  })
  status: QuestStatus;

  // Quest requirements
  @Column()
  taskDescription: string; // e.g., "Send 3 tokens"

  @Column('int')
  targetCount: number; // e.g., 3

  @Column()
  taskType: string; // e.g., "SEND_TOKENS", "SEND_MESSAGES", etc.

  // Rewards
  @Column({
    type: 'enum',
    enum: RewardType,
    default: RewardType.XP
  })
  rewardType: RewardType;

  @Column('int')
  rewardAmount: number;

  @Column('int', { default: 0 })
  bonusTokens: number;

  // Streak configuration
  @Column('boolean', { default: false })
  supportsStreak: boolean;

  @Column('int', { default: 0 })
  streakBonusXp: number; // Bonus XP per streak day

  // Frenzy/Boost configuration
  @Column('boolean', { default: true })
  allowsFrenzyBoost: boolean;

  // Timing
  @Column('time', { nullable: true })
  resetTime: string; // e.g., "00:00:00" for daily reset

  @Column('timestamp', { nullable: true })
  startsAt: Date;

  @Column('timestamp', { nullable: true })
  endsAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserQuestProgress, progress => progress.quest)
  userProgress: UserQuestProgress[];
}