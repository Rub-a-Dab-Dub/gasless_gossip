import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('reward_configs')
export class RewardConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  tokenAddress: string;

  @Column()
  topWinnersCount: number;

  @Column('decimal', { precision: 18, scale: 8 })
  rewardAmount: number;

  @Column('decimal', { precision: 18, scale: 8 })
  maxValueCap: number;

  @Column()
  frequency: DropFrequency;

  @Column()
  cronExpression: string;

  @Column('simple-array', { nullable: true })
  eligibilityCriteria: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}