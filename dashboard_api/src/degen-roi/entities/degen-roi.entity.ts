import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('degen_roi')
@Index(['roomCategory', 'timestamp'])
export class DegenRoiEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  roomCategory: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  winRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalWagered: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalReturned: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  roiPercentage: number;

  @Column({ type: 'int' })
  totalBets: number;

  @Column({ type: 'int' })
  winningBets: number;

  @Column({ type: 'int' })
  losingBets: number;

  @Column({ type: 'boolean', default: false })
  isAnomaly: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  avgBetSize: number;

  @Column({ type: 'jsonb', nullable: true })
  outcomeDistribution: Record<string, any>;

  @CreateDateColumn()
  timestamp: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}