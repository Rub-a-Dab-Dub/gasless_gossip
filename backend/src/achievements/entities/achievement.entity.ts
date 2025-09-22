import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AchievementType {
  MESSAGES_SENT = 'messages_sent',
  ROOMS_JOINED = 'rooms_joined',
  PREDICTIONS_MADE = 'predictions_made',
  BETS_PLACED = 'bets_placed',
  GAMBLES_PLAYED = 'gambles_played',
  TRADES_COMPLETED = 'trades_completed',
  VISITS_MADE = 'visits_made',
  LEVEL_REACHED = 'level_reached',
  STREAK_DAYS = 'streak_days',
  TOKENS_EARNED = 'tokens_earned',
}

export enum AchievementTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
}

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({
    type: 'enum',
    enum: AchievementType,
  })
  type!: AchievementType;

  @Column({
    type: 'enum',
    enum: AchievementTier,
    default: AchievementTier.BRONZE,
  })
  tier!: AchievementTier;

  @Column({ name: 'milestone_value', type: 'integer' })
  milestoneValue!: number;

  @Column({ name: 'reward_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  rewardAmount!: number;

  @Column({ name: 'stellar_transaction_hash', nullable: true })
  stellarTransactionHash?: string;

  @Column({ name: 'is_claimed', default: false })
  isClaimed!: boolean;

  @CreateDateColumn({ name: 'awarded_at' })
  awardedAt!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
