import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('analytics_snapshots')
@Index(['timestamp'])
@Index(['metricType'])
export class AnalyticsSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column()
  metricType: string; // 'dau', 'token_volume'

  @Column('jsonb')
  metrics: {
    currentValue: number;
    previousValue: number;
    percentageChange: number;
    historicalTrend: number[];
    userLevelDistribution: {
      [level: string]: number; // e.g., "1-5": 1000, "6-10": 500
    };
  };

  @Column('jsonb')
  socialMetrics: {
    activeRooms: number;
    messagesSent: number;
    averageEngagement: number;
  };

  @Column('jsonb')
  tokenMetrics: {
    dailyVolume: number;
    uniqueSenders: number;
    averageTransactionSize: number;
  };

  @Column('boolean', { default: false })
  hasAlert: boolean;

  @Column('jsonb', { nullable: true })
  alertData?: {
    type: 'spike' | 'drop' | 'anomaly';
    threshold: number;
    actualValue: number;
    description: string;
  };

  @CreateDateColumn()
  createdAt: Date;
}