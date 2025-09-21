import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm"
import { User } from "../../users/entities/user.entity"

export interface NftMetadata {
  name: string
  description: string
  image: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
  external_url?: string
  animation_url?: string
  background_color?: string
}

export interface NftTransferLog {
  from: string
  to: string
  timestamp: Date
  transactionId: string
  blockNumber?: number
}

@Entity("nfts")
@Index(["userId"])
@Index(["txId"])
@Index(["contractAddress", "tokenId"])
export class Nft {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "user_id" })
  userId: string

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: "user_id" })
  user: User

  @Column({ type: "jsonb" })
  metadata: NftMetadata

  @Column({ name: "tx_id", unique: true })
  txId: string

  @Column({ name: "contract_address" })
  contractAddress: string

  @Column({ name: "token_id" })
  tokenId: string

  @Column({ name: "stellar_asset_code", nullable: true })
  stellarAssetCode?: string

  @Column({ name: "stellar_asset_issuer", nullable: true })
  stellarAssetIssuer?: string

  @Column({ type: "jsonb", name: "transfer_logs", default: "[]" })
  transferLogs: NftTransferLog[]

  @Column({ name: "mint_price", type: "decimal", precision: 18, scale: 7, nullable: true })
  mintPrice?: string

  @Column({ name: "current_owner", default: true })
  currentOwner: boolean

  @Column({ name: "rarity_score", type: "decimal", precision: 10, scale: 2, nullable: true })
  rarityScore?: number

  @Column({ name: "collection_id", nullable: true })
  collectionId?: string

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
