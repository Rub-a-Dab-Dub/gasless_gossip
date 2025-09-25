import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { ChallengeParticipation } from './challenge-participation.entity';

export enum ChallengeStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export enum ChallengeType {
  GIFT_SENDING = 'gift_sending',
  MESSAGE_COUNT = 'message_count',
  XP_GAIN = 'xp_gain',
  TOKEN_TRANSFER = 'token_transfer',
  REFERRAL = 'referral',
  CUSTOM = 'custom'
}

@Entity('challenges')
@Index(['status'])
@Index(['type'])
@Index(['expiresAt'])
@Index(['createdAt'])
export class Challenge {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 200 })
  title!: string;

  @Column({ length: 1000, nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ChallengeType
  })
  type!: ChallengeType;

  @Column('int')
  goal!: number;

  @Column('decimal', { precision: 10, scale: 7, default: 0 })
  reward!: number;

  @Column({
    type: 'enum',
    enum: ChallengeStatus,
    default: ChallengeStatus.ACTIVE
  })
  status!: ChallengeStatus;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ length: 50, nullable: true })
  createdBy?: string;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @Column({ default: 0 })
  participantCount!: number;

  @Column({ default: 0 })
  completionCount!: number;

  @OneToMany(() => ChallengeParticipation, (participation) => participation.challenge)
  participations!: ChallengeParticipation[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
