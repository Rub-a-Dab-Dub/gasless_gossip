import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('badges')
export class Badge {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @ManyToOne(() => User, user => user.badges)
  user!: User;

  @Column()
  type!: string;

  @Column('jsonb', { nullable: true })
  metadata!: Record<string, any>;
}
