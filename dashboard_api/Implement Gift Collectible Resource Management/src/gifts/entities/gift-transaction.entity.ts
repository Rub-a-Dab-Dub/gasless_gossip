import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";

export enum TransactionType {
  MINT = "mint",
  BURN = "burn",
  GIFT = "gift",
  TRADE = "trade",
  BATTLE_REWARD = "battle_reward",
  ADMIN_ASSIGN = "admin_assign",
  ADMIN_REVOKE = "admin_revoke",
}

@Entity("gift_transactions")
@Index(["giftId", "createdAt"])
@Index(["fromUserId", "createdAt"])
@Index(["toUserId", "createdAt"])
export class GiftTransaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  giftId: string;

  @Column({ type: "enum", enum: TransactionType })
  type: TransactionType;

  @Column({ type: "uuid", nullable: true })
  fromUserId: string;

  @Column({ type: "uuid", nullable: true })
  toUserId: string;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @Column({ type: "jsonb", nullable: true })
  metadata: {
    battleId?: string;
    roomId?: string;
    reason?: string;
    adminId?: string;
  };

  @CreateDateColumn()
  createdAt: Date;
}
