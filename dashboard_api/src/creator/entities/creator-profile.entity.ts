import { User } from '../../user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('creator_profiles')
@Index(['userId'])
@Index(['status'])
export class CreatorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 32, default: 'inactive' })
  status: 'inactive' | 'pending' | 'active' | 'downgraded';

  @Column({ type: 'json', nullable: true })
  accessLists: {
    allow?: string[]; // userIds allowed for gated content
    deny?: string[];  // userIds denied explicitly
  } | null;

  @Column({ type: 'json', nullable: true })
  thresholds: {
    minBalance?: string; // ERC20 minimal balance requirement (wei as string)
    minTips?: number;
    minVisits?: number;
  } | null;

  @Column({ type: 'json', nullable: true })
  aggregates: {
    totalTips?: number;
    totalVisits?: number;
    totalEarnings?: number;
  } | null;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  downgradedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


