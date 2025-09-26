import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm"
import { User } from "../../users/entities/user.entity"

export enum InvitationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  EXPIRED = "expired",
  REVOKED = "revoked",
}

@Entity("invitations")
@Index(["code"], { unique: true })
@Index(["roomId", "inviterId"])
@Index(["expiresAt"])
export class Invitation {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  roomId: string

  @Column({ type: "uuid" })
  inviterId: string

  @Column({ type: "uuid", nullable: true })
  inviteeId?: string

  @Column({ type: "varchar", length: 12, unique: true })
  code: string

  @Column({ type: "varchar", length: 255, nullable: true })
  message?: string

  @Column({ type: "enum", enum: InvitationStatus, default: InvitationStatus.PENDING })
  status: InvitationStatus

  @Column({ type: "timestamp" })
  expiresAt: Date

  @Column({ type: "timestamp", nullable: true })
  acceptedAt?: Date

  @Column({ type: "varchar", length: 255, nullable: true })
  stellarTxId?: string

  @Column({ type: "int", default: 0 })
  usageCount: number

  @Column({ type: "int", default: 1 })
  maxUsage: number

  @Column({ type: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "inviterId" })
  inviter: User

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: "inviteeId" })
  invitee?: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Virtual properties
  get isExpired(): boolean {
    return new Date() > this.expiresAt
  }

  get isUsable(): boolean {
    return this.status === InvitationStatus.PENDING && !this.isExpired && this.usageCount < this.maxUsage
  }

  get remainingUses(): number {
    return Math.max(0, this.maxUsage - this.usageCount)
  }
}
