import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm"

@Entity("dau_alerts")
@Index(["alertDate", "isResolved"])
@Index(["featureName", "alertDate"])
export class DauAlert {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "alert_date", type: "timestamp" })
  @Index()
  alertDate: Date

  @Column({ name: "feature_name", type: "varchar" })
  featureName: string

  @Column({ name: "alert_type", type: "varchar" })
  alertType: "drop" | "spike" | "threshold"

  @Column({ name: "severity", type: "varchar" })
  severity: "low" | "medium" | "high" | "critical"

  @Column({ name: "current_value", type: "integer" })
  currentValue: number

  @Column({ name: "expected_value", type: "integer" })
  expectedValue: number

  @Column({ name: "drop_percentage", type: "decimal", precision: 5, scale: 2, nullable: true })
  dropPercentage: number

  @Column({ name: "message", type: "text" })
  message: string

  @Column({ name: "is_resolved", type: "boolean", default: false })
  isResolved: boolean

  @Column({ name: "resolved_at", type: "timestamp", nullable: true })
  resolvedAt: Date

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date
}
