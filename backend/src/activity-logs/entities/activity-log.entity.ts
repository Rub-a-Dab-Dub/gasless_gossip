import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm"
import { User } from "../../users/entities/user.entity"

export enum ActivityAction {
  MESSAGE_SENT = "message_sent",
  MESSAGE_RECEIVED = "message_received",
  TIP_SENT = "tip_sent",
  TIP_RECEIVED = "tip_received",
  ROOM_JOINED = "room_joined",
  ROOM_LEFT = "room_left",
  PROFILE_UPDATED = "profile_updated",
  BADGE_EARNED = "badge_earned",
  LEVEL_UP = "level_up",
  NFT_MINTED = "nft_minted",
  NFT_TRANSFERRED = "nft_transferred",
  LOGIN = "login",
  LOGOUT = "logout",
}

@Entity("activity_logs")
@Index(["userId", "createdAt"])
@Index(["action", "createdAt"])
export class ActivityLog {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("uuid")
  userId: string

  @Column({
    type: "enum",
    enum: ActivityAction,
  })
  action: ActivityAction

  @Column("jsonb", { nullable: true })
  metadata: Record<string, any>

  @Column({ nullable: true })
  roomId: string

  @Column({ nullable: true })
  targetUserId: string

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  amount: number

  @Column({ nullable: true })
  ipAddress: string

  @Column({ nullable: true })
  userAgent: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "targetUserId" })
  targetUser: User
}
