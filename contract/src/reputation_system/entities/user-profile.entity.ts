import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryColumn()
  address: Address;

  @Column({ type: 'varchar', length: 255, nullable: true })
  username?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'bigint', default: 0 })
  xp: number;

  @Column({ type: 'bigint', default: 0 })
  reputation: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ReputationHistoryEntity, history => history.user)
  reputationHistory: ReputationHistoryEntity[];
}

@Entity('reputation_history')
export class ReputationHistoryEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: Address;

  @Column({ type: 'bigint' })
  amount: number;

  @Column({ type: 'enum', enum: ReputationReason })
  reason: ReputationReason;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => UserProfile, user => user.reputationHistory)
  @JoinColumn({ name: 'userId' })
  user: UserProfile;
}