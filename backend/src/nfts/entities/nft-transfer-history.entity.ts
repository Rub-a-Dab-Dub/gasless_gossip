import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from "typeorm"
import { Nft } from "./nft.entity"

@Entity("nft_transfer_history")
@Index(["nftId"])
@Index(["fromUserId"])
@Index(["toUserId"])
@Index(["transactionId"])
@Index(["timestamp"])
export class NftTransferHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "nft_id" })
  nftId: string

  @ManyToOne(() => Nft, { eager: false })
  @JoinColumn({ name: "nft_id" })
  nft: Nft

  @Column({ name: "from_address" })
  fromAddress: string

  @Column({ name: "to_address" })
  toAddress: string

  @Column({ name: "from_user_id", nullable: true })
  fromUserId?: string

  @Column({ name: "to_user_id", nullable: true })
  toUserId?: string

  @Column({ name: "transaction_id" })
  transactionId: string

  @Column({ name: "block_number", nullable: true })
  blockNumber?: number

  @Column({ name: "gas_used", nullable: true })
  gasUsed?: number

  @Column({ name: "transfer_type", type: "enum", enum: ["mint", "transfer", "burn"] })
  transferType: "mint" | "transfer" | "burn"

  @Column({ type: "timestamp with time zone" })
  timestamp: Date

  @Column({ type: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date
}
