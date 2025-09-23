import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  referrerId: string;

  @Column('uuid')
  refereeId: string;

  @Column('decimal', { precision: 10, scale: 7, default: 0 })
  reward: number;

  @Column({ length: 100, unique: true })
  referralCode: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'completed' | 'failed';

  @Column({ nullable: true })
  stellarTransactionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;
}