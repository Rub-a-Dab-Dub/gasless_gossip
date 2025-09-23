import { Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('reward_votes')
@Unique('uq_reward_user', ['rewardId', 'userId'])
export class RewardVote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'reward_id', type: 'uuid' })
  @Index('idx_reward_votes_reward_id')
  rewardId!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index('idx_reward_votes_user_id')
  userId!: string;

  @Column({ name: 'vote_weight', type: 'numeric', precision: 20, scale: 8, default: 0 })
  voteWeight!: string;

  @Column({ name: 'stellar_account_id', nullable: true })
  stellarAccountId?: string;

  @Column({ name: 'stellar_tx_hash', nullable: true })
  stellarTxHash?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}


