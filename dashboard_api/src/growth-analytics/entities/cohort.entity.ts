import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity("cohorts")
export class Cohort {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "cohort_name", type: "varchar", unique: true })
  @Index()
  cohortName: string

  @Column({ name: "start_date", type: "date" })
  startDate: Date

  @Column({ name: "end_date", type: "date", nullable: true })
  endDate: Date

  @Column({ name: "description", type: "text", nullable: true })
  description: string

  @Column({ name: "user_count", type: "integer", default: 0 })
  userCount: number

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
