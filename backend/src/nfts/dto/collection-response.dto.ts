import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import type { NftCollection, CollectionMetadata } from "../entities/nft-collection.entity"

export class CollectionResponseDto {
  @ApiProperty({
    description: "Collection unique identifier",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string

  @ApiProperty({
    description: "Collection name",
    example: "Whisper Legends",
  })
  name: string

  @ApiProperty({
    description: "Collection symbol",
    example: "WLEG",
  })
  symbol: string

  @ApiProperty({
    description: "Collection description",
    example: "A collection of legendary characters from the Whisper universe",
  })
  description: string

  @ApiProperty({
    description: "Collection metadata",
  })
  metadata: CollectionMetadata

  @ApiProperty({
    description: "Smart contract address",
    example: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
  })
  contractAddress: string

  @ApiProperty({
    description: "Creator address",
    example: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
  })
  creatorAddress: string

  @ApiProperty({
    description: "Total number of minted NFTs",
    example: 150,
  })
  totalSupply: number

  @ApiPropertyOptional({
    description: "Maximum supply of NFTs",
    example: 10000,
  })
  maxSupply?: number

  @ApiPropertyOptional({
    description: "Floor price in XLM",
    example: "5.0000000",
  })
  floorPrice?: string

  @ApiProperty({
    description: "Whether the collection is verified",
    example: true,
  })
  isVerified: boolean

  @ApiProperty({
    description: "Creation timestamp",
    example: "2024-01-15T10:30:00Z",
  })
  createdAt: Date

  @ApiProperty({
    description: "Last update timestamp",
    example: "2024-01-15T10:30:00Z",
  })
  updatedAt: Date

  constructor(collection: NftCollection) {
    this.id = collection.id
    this.name = collection.name
    this.symbol = collection.symbol
    this.description = collection.description
    this.metadata = collection.metadata
    this.contractAddress = collection.contractAddress
    this.creatorAddress = collection.creatorAddress
    this.totalSupply = collection.totalSupply
    this.maxSupply = collection.maxSupply
    this.floorPrice = collection.floorPrice
    this.isVerified = collection.isVerified
    this.createdAt = collection.createdAt
    this.updatedAt = collection.updatedAt
  }
}
