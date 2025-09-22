import { User } from '../../users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity('levels')
@Index(['userId', 'level'], { unique: true })
export class Level {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'integer', default: 1 })
  level!: number;

  @Column({ name: 'current_xp', type: 'integer', default: 0 })
  currentXp!: number;

  @Column({ name: 'xp_threshold', type: 'integer' })
  xpThreshold!: number;

  @Column({ name: 'total_xp', type: 'integer', default: 0 })
  totalXp!: number;

  @Column({ name: 'is_level_up_pending', type: 'boolean', default: false })
  isLevelUpPending!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
