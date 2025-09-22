import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm"
import { User } from "../../users/entities/user.entity"

export enum ParticipantRole {
  OWNER = "owner",
  ADMIN = "admin",
  MEMBER = "member",
  GUEST = "guest",
}

export enum ParticipantStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned",
  LEFT = "left",
}

@Entity("room_participants")
@Index(["roomId", "userId"], { unique: true })
@Index(["roomId", "role"])
@Index(["userId", "status"])
export class RoomParticipant {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  roomId: string

  @Column({ type: "uuid" })
  userId: string

  @Column({ type: "enum", enum: ParticipantRole, default: ParticipantRole.MEMBER })
  role: ParticipantRole

  @Column({ type: "enum", enum: ParticipantStatus, default: ParticipantStatus.ACTIVE })
  status: ParticipantStatus

  @Column({ type: "uuid", nullable: true })
  invitationId?: string

  @Column({ type: "timestamp", nullable: true })
  joinedAt?: Date

  @Column({ type: "timestamp", nullable: true })
  lastActiveAt?: Date

  @Column({ type: "jsonb", nullable: true })
  permissions?: Record<string, boolean>

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "userId" })
  user: User

  @CreateDateColumn()
  createdAt: Date

  // Virtual properties
  get isActive(): boolean {
    return this.status === ParticipantStatus.ACTIVE
  }

  get canInvite(): boolean {
    return (
      this.role === ParticipantRole.OWNER ||
      this.role === ParticipantRole.ADMIN ||
      (this.permissions?.canInvite ?? false)
    )
  }

  get canManage(): boolean {
    return this.role === ParticipantRole.OWNER || this.role === ParticipantRole.ADMIN
  }
}
