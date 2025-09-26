import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  roomId: string

  @Column({ type: "uuid" })
  userId: string

  @Column({ type: "text" })
  content: string

  @Column({ type: "varchar", length: 50, default: "text" })
  messageType: string

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ type: "boolean", default: false })
  isDeleted: boolean
}
