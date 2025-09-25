import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Challenge } from './challenge.entity';

export enum ParticipationStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ABANDONED = 'abandoned'
}

@Entity('challenge_participations')
@Index(['userId'])
@Index(['challengeId'])
@Index(['status'])
@Index(['completedAt'])
export class ChallengeParticipation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column('uuid')
  challengeId!: string;

  @Column({
    type: 'enum',
    enum: ParticipationStatus,
    default: ParticipationStatus.ACTIVE
  })
  status!: ParticipationStatus;

  @Column('int', { default: 0 })
  progress!: number;

  @Column('decimal', { precision: 10, scale: 7, default: 0 })
  rewardEarned!: number;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'json', nullable: true })
  progressData?: Record<string, any>;

  @Column({ length: 100, nullable: true })
  stellarTransactionId?: string;

  @ManyToOne(() => Challenge, (challenge) => challenge.participations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'challengeId' })
  challenge!: Challenge;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
