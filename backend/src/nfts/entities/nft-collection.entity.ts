import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Nft } from "./nft.entity"

export interface CollectionMetadata {
  name: string
  description: string
  image: string
  banner_image?: string
  external_link?: string
  seller_fee_basis_points?: number
  fee_recipient?: string
}

@Entity("nft_collections")
export class NftCollection {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  name: string

  @Column({ unique: true })
  symbol: string

  @Column({ type: "text" })
  description: string

  @Column({ type: "jsonb" })
  metadata: CollectionMetadata

  @Column({ name: "contract_address", unique: true })
  contractAddress: string

  @Column({ name: "creator_address" })
  creatorAddress: string

  @Column({ name: "total_supply", default: 0 })
  totalSupply: number

  @Column({ name: "max_supply", nullable: true })
  maxSupply?: number

  @Column({ name: "floor_price", type: "decimal", precision: 18, scale: 7, nullable: true })
  floorPrice?: string

  @Column({ name: "is_verified", default: false })
  isVerified: boolean

  @OneToMany(
    () => Nft,
    (nft) => nft.collectionId,
  )
  nfts: Nft[]

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
