import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserQuestProgress } from './user-quest-progress.entity';

export enum QuestType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  SPECIAL = 'special'
}

export enum QuestStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ENDED = 'ended'
}

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

  @Column('int')
  requiredCount: number; // e.g., "Send 3 tokens"

  @Column('int')
  xpReward: number;

  @Column('int')
  tokenReward: number;

  @Column('decimal', { precision: 10, scale: 2, default: 1.0 })
  frenzyMultiplier: number; // Boost multiplier during frenzies

  @Column('boolean', { default: false })
  isFrenzyActive: boolean;

  @Column('boolean', { default: true })
  enableStreaks: boolean;

  @Column('int', { default: 0 })
  streakBonusXp: number; // Bonus XP per streak day

  @Column('timestamp', { nullable: true })
  endsAt: Date;

  @OneToMany(() => UserQuestProgress, progress => progress.quest)
  userProgress: UserQuestProgress[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}