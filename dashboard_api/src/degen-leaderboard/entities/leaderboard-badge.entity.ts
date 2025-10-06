import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity("leaderboard_badges")
@Index(["userId", "badgeType"])
export class LeaderboardBadge {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  @Index()
  userId: string

  @Column({ type: "varchar", length: 50 })
  @Index()
  badgeType: string // 'whale', 'degen', 'risk_master', 'high_roller', 'streak_king'

  @Column({ type: "varchar", length: 255 })
  badgeName: string

  @Column({ type: "text" })
  description: string

  @Column({ type: "varchar", length: 50 })
  tier: string // 'bronze', 'silver', 'gold', 'platinum', 'diamond'

  @Column({ type: "varchar", length: 255, nullable: true })
  iconUrl: string

  @Column({ type: "timestamp" })
  awardedAt: Date

  @Column({ type: "varchar", length: 255, nullable: true })
  awardedBy: string

  @Column({ type: "jsonb", nullable: true })
  criteria: {
    minScore?: number
    minWagered?: number
    minBets?: number
    minRank?: number
  }

  @Column({ type: "boolean", default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
