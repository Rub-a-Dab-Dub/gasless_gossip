import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm"

@Entity("leaderboard_events")
@Index(["userId", "eventType", "createdAt"])
export class LeaderboardEvent {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  @Index()
  userId: string

  @Column({ type: "varchar", length: 50 })
  @Index()
  eventType: string // 'rank_change', 'badge_awarded', 'milestone_reached', 'cycle_reset'

  @Column({ type: "varchar", length: 50, nullable: true })
  category: string

  @Column({ type: "jsonb" })
  data: {
    oldRank?: number
    newRank?: number
    badgeType?: string
    milestone?: string
    score?: number
  }

  @Column({ type: "text", nullable: true })
  description: string

  @CreateDateColumn()
  @Index()
  createdAt: Date
}
