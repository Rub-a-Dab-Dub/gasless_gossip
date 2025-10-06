import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('finance_metrics_daily_aggregates')
export class DailyAggregate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column('decimal', { precision: 24, scale: 8 })
  dailyVolume: number;

  @Column('decimal', { precision: 24, scale: 8 })
  cumulativeVolume: number;

  @Column('jsonb', { nullable: true })
  topUsers: {
    userId: string;
    volume: number;
    transactionCount: number;
  }[];

  @Column('jsonb', { nullable: true })
  trends: {
    volumeGrowth: number;
    userGrowth: number;
    predictedVolume: number;
  };

  @Column('boolean', { default: false })
  hasSpike: boolean;

  @Column('jsonb', { nullable: true })
  spikeData: {
    magnitude: number;
    reason: string;
  };

  @Column('integer')
  transactionCount: number;

  @Column('integer')
  uniqueUsers: number;

  @Column('integer')
  blockNumber: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}