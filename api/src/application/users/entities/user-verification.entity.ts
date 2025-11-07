import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_verification')
export class UserVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column({ name: 'user_id' })
  userId: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column({
    type: 'varchar',
    default: 'verify-email',
  })
  type: 'verify-email' | 'forgot-password';

  @Column({ default: false })
  is_used: boolean;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.verifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
