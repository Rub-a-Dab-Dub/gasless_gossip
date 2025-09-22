import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { PollVote } from './poll-vote.entity';

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  roomId!: string;

  @Column({ type: 'text' })
  question!: string;

  @Column({ type: 'jsonb' })
  options!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => PollVote, (vote) => vote.poll)
  votes!: PollVote[];
}


