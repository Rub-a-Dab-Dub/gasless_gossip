import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm"

@Entity("xp_change_notifications")
@Index(["userId", "isRead"])
export class XpChangeNotification {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ nullable: true })
  @Index()
  userId: string // null for global notifications

  @Column({ type: "varchar", length: 50 })
  notificationType: string // 'rule_change', 'multiplier_update', 'event_bonus'

  @Column({ type: "varchar", length: 255 })
  title: string

  @Column({ type: "text" })
  message: string

  @Column({ type: "jsonb", nullable: true })
  changes: {
    ruleId?: string
    ruleName?: string
    oldValue?: number
    newValue?: number
    impact?: string
  }

  @Column({ type: "boolean", default: false })
  @Index()
  isRead: boolean

  @Column({ type: "timestamp", nullable: true })
  readAt: Date

  @CreateDateColumn()
  createdAt: Date
}
