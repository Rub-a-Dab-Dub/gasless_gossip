import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity("xp_rules")
@Index(["ruleType", "isActive"])
export class XpRule {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "varchar", length: 255 })
  @Index()
  ruleName: string

  @Column({ type: "varchar", length: 50 })
  @Index()
  ruleType: string // 'quest', 'level', 'achievement', 'daily', 'bonus'

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "decimal", precision: 10, scale: 2, default: 1.0 })
  multiplier: number

  @Column({ type: "int", default: 0 })
  baseAmount: number

  @Column({ type: "jsonb", nullable: true })
  conditions: {
    minLevel?: number
    maxLevel?: number
    questType?: string
    timeWindow?: string
    userSegment?: string
  }

  @Column({ type: "boolean", default: true })
  @Index()
  isActive: boolean

  @Column({ type: "int", default: 0 })
  priority: number

  @Column({ type: "varchar", length: 50, default: "global" })
  @Index()
  scope: string // 'global', 'user_segment', 'ab_test'

  @Column({ type: "varchar", length: 255, nullable: true })
  abTestGroup: string

  @Column({ type: "timestamp", nullable: true })
  startDate: Date

  @Column({ type: "timestamp", nullable: true })
  endDate: Date

  @Column({ type: "varchar", length: 255, nullable: true })
  createdBy: string

  @Column({ type: "varchar", length: 255, nullable: true })
  updatedBy: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
