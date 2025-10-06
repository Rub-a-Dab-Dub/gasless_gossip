import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import type { BulkAction } from "./bulk-action.entity"

@Entity("room_action_results")
export class RoomActionResult {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  bulkActionId: string

  @ManyToOne("BulkAction")
  @JoinColumn({ name: "bulkActionId" })
  bulkAction: BulkAction

  @Column()
  roomId: string

  @Column()
  status: "success" | "failed" | "skipped" | "rolled_back"

  @Column({ type: "jsonb", nullable: true })
  previousState: Record<string, any>

  @Column({ type: "jsonb", nullable: true })
  newState: Record<string, any>

  @Column({ type: "text", nullable: true })
  errorMessage: string

  @Column({ type: "int", nullable: true })
  executionTimeMs: number

  @CreateDateColumn()
  createdAt: Date
}
