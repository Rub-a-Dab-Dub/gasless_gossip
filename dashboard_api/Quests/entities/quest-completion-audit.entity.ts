@Entity('quest_completion_audits')
export class QuestCompletionAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  questId: string;

  @Column('uuid')
  progressId: string;

  @Column('int')
  progressSnapshot: number;

  @Column('int')
  streakSnapshot: number;

  @Column('decimal', { precision: 5, scale: 2 })
  multiplierApplied: number;

  @Column('int')
  xpAwarded: number;

  @Column('int')
  tokensAwarded: number;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  completedAt: Date;

  @ManyToOne(() => UserQuestProgress, progress => progress.completionAudits)
  @JoinColumn({ name: 'progressId' })
  userProgress: UserQuestProgress;
}