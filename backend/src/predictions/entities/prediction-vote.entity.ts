import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Prediction } from './prediction.entity';
import { User } from '../../users/entities/user.entity';

@Entity('prediction_votes')
@Unique(['predictionId', 'userId'])
export class PredictionVote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'prediction_id' })
  predictionId!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ type: 'boolean' })
  isCorrect!: boolean;

  @Column({ type: 'decimal', precision: 18, scale: 7, default: 0 })
  rewardAmount!: number;

  @Column({ name: 'reward_claimed', default: false })
  rewardClaimed!: boolean;

  @Column({ name: 'tx_id', nullable: true })
  txId?: string;

  @ManyToOne(() => Prediction, prediction => prediction.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'prediction_id' })
  prediction!: Prediction;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
