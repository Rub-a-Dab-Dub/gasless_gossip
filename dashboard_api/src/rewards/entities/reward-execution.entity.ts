@Entity('reward_executions')
export class RewardExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  configId: string;

  @Column('simple-json')
  winners: Array<{ userId: string; address: string; score: number }>;

  @Column({ nullable: true })
  transactionHash: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @Column('text', { nullable: true })
  errorMessage: string;

  @Column('decimal', { precision: 18, scale: 8 })
  totalDistributed: number;

  @CreateDateColumn()
  executedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}