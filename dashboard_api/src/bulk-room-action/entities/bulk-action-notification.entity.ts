import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity("bulk_action_notifications")
export class BulkActionNotification {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  bulkActionId: string

  @Column()
  recipientId: string

  @Column()
  notificationType: "started" | "completed" | "failed" | "partial_success"

  @Column({ type: "text" })
  message: string

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @Column({ default: false })
  isRead: boolean

  @CreateDateColumn()
  createdAt: Date
}
