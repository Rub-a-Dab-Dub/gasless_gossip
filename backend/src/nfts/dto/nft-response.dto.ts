import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import type { Nft, NftMetadata, NftTransferLog } from "../entities/nft.entity"

export class NftResponseDto {
  @ApiProperty({
    description: "NFT unique identifier",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string

  @ApiProperty({
    description: "Owner user ID",
    example: "987fcdeb-51a2-43d1-9f12-345678901234",
  })
  userId: string

  @ApiProperty({
    description: "NFT metadata",
    example: {
      name: "Whisper Collectible #001",
      description: "A rare collectible from the Whisper universe",
      image: "https://example.com/nft-image.png",
      attributes: [
        { trait_type: "Background", value: "Blue" },
        { trait_type: "Rarity", value: "Legendary" },
      ],
    },
  })
  metadata: NftMetadata

  @ApiProperty({
    description: "Stellar transaction ID",
    example: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
  })
  txId: string

  @ApiProperty({
    description: "Smart contract address",
    example: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
  })
  contractAddress: string

  @ApiProperty({
    description: "Token ID within the contract",
    example: "WHISPER001ABC",
  })
  tokenId: string

  @ApiPropertyOptional({
    description: "Stellar asset code",
    example: "WHISPER001",
  })
  stellarAssetCode?: string

  @ApiPropertyOptional({
    description: "Stellar asset issuer",
    example: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
  })
  stellarAssetIssuer?: string

  @ApiProperty({
    description: "Transfer history logs",
    example: [
      {
        from: "mint",
        to: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
        timestamp: "2024-01-15T10:30:00Z",
        transactionId: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      },
    ],
  })
  transferLogs: NftTransferLog[]

  @ApiPropertyOptional({
    description: "Mint price in XLM",
    example: "10.5000000",
  })
  mintPrice?: string

  @ApiProperty({
    description: "Whether the user is the current owner",
    example: true,
  })
  currentOwner: boolean

  @ApiPropertyOptional({
    description: "Calculated rarity score",
    example: 85.5,
  })
  rarityScore?: number

  @ApiPropertyOptional({
    description: "Collection ID if part of a collection",
    example: "456e7890-e12b-34d5-a678-901234567890",
  })
  collectionId?: string

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

  constructor(nft: Nft) {
    this.id = nft.id
    this.userId = nft.userId
    this.metadata = nft.metadata
    this.txId = nft.txId
    this.contractAddress = nft.contractAddress
    this.tokenId = nft.tokenId
    this.stellarAssetCode = nft.stellarAssetCode
    this.stellarAssetIssuer = nft.stellarAssetIssuer
    this.transferLogs = nft.transferLogs
    this.mintPrice = nft.mintPrice
    this.currentOwner = nft.currentOwner
    this.rarityScore = nft.rarityScore
    this.collectionId = nft.collectionId
    this.createdAt = nft.createdAt
    this.updatedAt = nft.updatedAt
  }
}
