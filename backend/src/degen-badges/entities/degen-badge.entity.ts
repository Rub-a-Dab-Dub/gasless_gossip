import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { User } from "../../users/entities/user.entity"

export enum DegenBadgeType {
  HIGH_ROLLER = "high_roller",
  RISK_TAKER = "risk_taker",
  STREAK_MASTER = "streak_master",
  WHALE_HUNTER = "whale_hunter",
  DIAMOND_HANDS = "diamond_hands",
  DEGEN_LEGEND = "degen_legend",
}

export enum DegenBadgeRarity {
  COMMON = "common",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
}

@Entity("degen_badges")
export class DegenBadge {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("uuid")
  userId: string

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "userId" })
  user: User

  @Column({
    type: "enum",
    enum: DegenBadgeType,
  })
  badgeType: DegenBadgeType

  @Column({
    type: "enum",
    enum: DegenBadgeRarity,
    default: DegenBadgeRarity.COMMON,
  })
  rarity: DegenBadgeRarity

  @Column("jsonb")
  criteria: {
    minAmount?: number
    streakLength?: number
    riskLevel?: number
    timeframe?: string
    conditions?: string[]
  }

  @Column({ nullable: true })
  txId: string

  @Column({ nullable: true })
  stellarAssetCode: string

  @Column({ nullable: true })
  stellarAssetIssuer: string

  @Column("text", { nullable: true })
  description: string

  @Column("text", { nullable: true })
  imageUrl: string

  @Column("decimal", { precision: 18, scale: 7, nullable: true })
  rewardAmount: number

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
