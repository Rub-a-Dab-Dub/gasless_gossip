import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('streaks')
export class StreakEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @Column({ type: 'integer', default: 0 })
  currentStreak: number;

  @Column({ type: 'integer', default: 0 })
  longestStreak: number;

  @Column({ type: 'timestamp', nullable: false })
  lastActivityDate: Date;

  @Column({ type: 'float', default: 1.0 })
  multiplier: number;

  @Column({ type: 'varchar', default: 'daily' })
  streakType: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}