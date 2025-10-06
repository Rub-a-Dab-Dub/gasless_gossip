import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("bulk_actions")
export class BulkAction {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  actionType: "update" | "delete" | "archive" | "restore" | "configure"

  @Column({ type: "jsonb" })
  targetRoomIds: string[]

  @Column({ type: "jsonb" })
  actionPayload: Record<string, any>

  @Column()
  status: "pending" | "preview" | "executing" | "completed" | "failed" | "partial"

  @Column({ type: "int", default: 0 })
  totalRooms: number

  @Column({ type: "int", default: 0 })
  successCount: number

  @Column({ type: "int", default: 0 })
  failureCount: number

  @Column({ type: "jsonb", nullable: true })
  errors: Array<{ roomId: string; error: string }>

  @Column({ nullable: true })
  executedBy: string

  @Column({ type: "timestamp", nullable: true })
  executedAt: Date

  @Column({ type: "int", nullable: true })
  executionTimeMs: number

  @Column({ default: false })
  isDryRun: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
