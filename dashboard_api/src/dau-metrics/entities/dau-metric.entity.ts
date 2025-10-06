import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity("dau_metrics")
@Index(["metricDate", "timezone"])
@Index(["featureName", "metricDate"])
export class DauMetric {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "metric_date", type: "date" })
  @Index()
  metricDate: Date

  @Column({ name: "timezone", type: "varchar", default: "UTC" })
  timezone: string

  @Column({ name: "feature_name", type: "varchar" })
  @Index()
  featureName: string

  @Column({ name: "unique_users", type: "integer", default: 0 })
  uniqueUsers: number

  @Column({ name: "total_sessions", type: "integer", default: 0 })
  totalSessions: number

  @Column({ name: "total_duration_seconds", type: "bigint", default: 0 })
  totalDurationSeconds: number

  @Column({ name: "new_users", type: "integer", default: 0 })
  newUsers: number

  @Column({ name: "returning_users", type: "integer", default: 0 })
  returningUsers: number

  @Column({ name: "benchmark_goal", type: "integer", nullable: true })
  benchmarkGoal: number

  @Column({ name: "metadata", type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
