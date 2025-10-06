import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm"

@Entity("feature_usage")
@Index(["userId", "featureName", "usageDate"])
@Index(["featureName", "usageDate"])
export class FeatureUsage {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "user_id", type: "uuid" })
  @Index()
  userId: string

  @Column({ name: "feature_name", type: "varchar" })
  featureName: string

  @Column({ name: "usage_date", type: "date" })
  usageDate: Date

  @Column({ name: "usage_timestamp", type: "timestamp" })
  usageTimestamp: Date

  @Column({ name: "timezone", type: "varchar", default: "UTC" })
  timezone: string

  @Column({ name: "session_id", type: "varchar", nullable: true })
  sessionId: string

  @Column({ name: "duration_seconds", type: "integer", nullable: true })
  durationSeconds: number

  @Column({ name: "is_new_user", type: "boolean", default: false })
  isNewUser: boolean

  @Column({ name: "metadata", type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date
}
