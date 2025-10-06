import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity("degen_scores")
@Index(["userId", "category", "cycleId"])
@Index(["category", "score"])
export class DegenScore {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  @Index()
  userId: string

  @Column({ type: "varchar", length: 255 })
  username: string

  @Column({ type: "varchar", length: 50 })
  @Index()
  category: string // 'overall', 'daily', 'weekly', 'monthly', 'high_roller', 'risk_taker'

  @Column({ type: "decimal", precision: 20, scale: 2 })
  @Index()
  score: number

  @Column({ type: "int", default: 0 })
  totalBets: number

  @Column({ type: "decimal", precision: 20, scale: 2, default: 0 })
  totalWagered: number

  @Column({ type: "decimal", precision: 20, scale: 2, default: 0 })
  totalWon: number

  @Column({ type: "decimal", precision: 20, scale: 2, default: 0 })
  totalLost: number

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  winRate: number

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  avgBetSize: number

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  riskScore: number // 0-100 scale

  @Column({ type: "varchar", length: 50, nullable: true })
  @Index()
  cycleId: string // 'cycle_2025_10', 'cycle_2025_w40'

  @Column({ type: "timestamp", nullable: true })
  cycleStartDate: Date

  @Column({ type: "timestamp", nullable: true })
  cycleEndDate: Date

  @Column({ type: "int", default: 0 })
  @Index()
  rank: number

  @Column({ type: "varchar", length: 50, nullable: true })
  badge: string // 'whale', 'degen', 'risk_master', 'high_roller'

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
