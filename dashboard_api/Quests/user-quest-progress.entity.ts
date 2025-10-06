@Entity('user_quest_progress')
export class UserQuestProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  questId: string;

  @Column('int', { default: 0 })
  currentProgress: number;

  @Column('int', { default: 0 })
  targetCount: number;

  @Column('boolean', { default: false })
  completed: boolean;

  @Column('timestamp', { nullable: true })
  completedAt: Date;

  // Streak tracking
  @Column('int', { default: 0 })
  currentStreak: number;

  @Column('int', { default: 0 })
  longestStreak: number;

  @Column('date', { nullable: true })
  lastCompletionDate: Date;

  // Frenzy boost
  @Column('decimal', { precision: 5, scale: 2, default: 1.0 })
  activeMultiplier: number;

  @Column('timestamp', { nullable: true })
  multiplierExpiresAt: Date;

  @Column('timestamp')
  lastResetAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Quest, quest => quest.userProgress)
  @JoinColumn({ name: 'questId' })
  quest: Quest;

  @OneToMany(() => QuestCompletionAudit, audit => audit.userProgress)
  completionAudits: QuestCompletionAudit[];
}
