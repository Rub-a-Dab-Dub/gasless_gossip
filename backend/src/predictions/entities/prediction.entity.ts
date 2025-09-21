import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';
import { User } from '../../users/entities/user.entity';
import { PredictionVote } from './prediction-vote.entity';

export enum PredictionStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  CANCELLED = 'cancelled',
}

export enum PredictionOutcome {
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
  PENDING = 'pending',
}

@Entity('predictions')
export class Prediction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'room_id' })
  roomId!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ length: 500 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 200 })
  prediction!: string;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt!: Date;

  @Column({
    type: 'enum',
    enum: PredictionStatus,
    default: PredictionStatus.ACTIVE,
  })
  status!: PredictionStatus;

  @Column({
    type: 'enum',
    enum: PredictionOutcome,
    default: PredictionOutcome.PENDING,
  })
  outcome!: PredictionOutcome;

  @Column({ name: 'vote_count', default: 0 })
  voteCount!: number;

  @Column({ name: 'correct_votes', default: 0 })
  correctVotes!: number;

  @Column({ name: 'incorrect_votes', default: 0 })
  incorrectVotes!: number;

  @Column({ type: 'decimal', precision: 18, scale: 7, name: 'reward_pool', default: 0 })
  rewardPool!: number;

  @Column({ type: 'decimal', precision: 18, scale: 7, name: 'reward_per_correct_vote', default: 0 })
  rewardPerCorrectVote!: number;

  @Column({ name: 'is_resolved', default: false })
  isResolved!: boolean;

  @Column({ type: 'timestamp', name: 'resolved_at', nullable: true })
  resolvedAt?: Date;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'room_id' })
  room!: Room;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => PredictionVote, vote => vote.prediction)
  votes!: PredictionVote[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
