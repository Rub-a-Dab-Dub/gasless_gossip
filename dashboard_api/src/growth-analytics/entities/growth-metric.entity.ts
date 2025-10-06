import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity("growth_metrics")
@Index(["userId", "metricDate"])
@Index(["cohortId", "metricDate"])
export class GrowthMetric {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "user_id", type: "uuid" })
  @Index()
  userId: string

  @Column({ name: "cohort_id", type: "varchar", nullable: true })
  @Index()
  cohortId: string

  @Column({ name: "metric_date", type: "date" })
  @Index()
  metricDate: Date

  @Column({ name: "user_level", type: "integer", default: 0 })
  userLevel: number

  @Column({ name: "unlocks_count", type: "integer", default: 0 })
  unlocksCount: number

  @Column({ name: "drop_off_point", type: "integer", nullable: true })
  dropOffPoint: number

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive: boolean

  @Column({ name: "session_duration", type: "integer", nullable: true })
  sessionDuration: number

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
