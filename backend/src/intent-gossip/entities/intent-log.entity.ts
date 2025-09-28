import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('intent_logs')
export class IntentLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  type!: string;

  @Column({ type: 'jsonb' })
  payload!: any;

  @Column({ type: 'jsonb' })
  chains!: string[];

  @ManyToOne(() => User, { eager: true })
  user!: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}