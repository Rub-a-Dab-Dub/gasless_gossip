import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('reputations')
export class Reputation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.reputations)
  user!: User;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  score!: number;

  @UpdateDateColumn()
  updatedAt!: Date;
}