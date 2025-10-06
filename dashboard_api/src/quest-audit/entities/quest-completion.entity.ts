import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity("quest_completions")
@Index(["userId", "questId", "completedAt"])
@Index(["questId", "completedAt"])
export class QuestCompletion {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  @Index()
  userId: string

  @Column()
  @Index()
  questId: string

  @Column({ type: "varchar", length: 255 })
  questName: string

  @Column({ type: "int" })
  rewardAmount: number

  @Column({ type: "varchar", length: 50 })
  rewardType: string

  @Column({ type: "timestamp" })
  @Index()
  completedAt: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @Column({ type: "varchar", length: 50, nullable: true })
  ipAddress: string

  @Column({ type: "varchar", length: 255, nullable: true })
  userAgent: string

  @Column({ type: "boolean", default: false })
  @Index()
  isFlagged: boolean

  @Column({ type: "boolean", default: false })
  @Index()
  isReversed: boolean

  @Column({ type: "text", nullable: true })
  reverseReason: string

  @Column({ type: "varchar", length: 255, nullable: true })
  reversedBy: string

  @Column({ type: "timestamp", nullable: true })
  reversedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
