import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
  Unique,
} from 'typeorm';
import { Poll } from './poll.entity';

@Entity('poll_votes')
@Unique(['pollId', 'userId'])
export class PollVote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  pollId!: string;

  @ManyToOne(() => Poll, (poll) => poll.votes, { onDelete: 'CASCADE' })
  poll!: Poll;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'int' })
  optionIndex!: number;

  @Column({ type: 'float', default: 1 })
  weight!: number;

  @CreateDateColumn()
  createdAt!: Date;
}


