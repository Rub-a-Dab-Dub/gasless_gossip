import { ApiProperty } from "@nestjs/swagger"
import { DegenBadgeType, DegenBadgeRarity } from "../entities/degen-badge.entity"

export class DegenBadgeResponseDto {
  @ApiProperty({ description: "Badge ID" })
  id: string

  @ApiProperty({ description: "User ID" })
  userId: string

  @ApiProperty({ enum: DegenBadgeType, description: "Badge type" })
  badgeType: DegenBadgeType

  @ApiProperty({ enum: DegenBadgeRarity, description: "Badge rarity" })
  rarity: DegenBadgeRarity

  @ApiProperty({ description: "Badge criteria" })
  criteria: object

  @ApiProperty({ required: false, description: "Stellar transaction ID" })
  txId?: string

  @ApiProperty({ required: false, description: "Stellar asset code" })
  stellarAssetCode?: string

  @ApiProperty({ required: false, description: "Stellar asset issuer" })
  stellarAssetIssuer?: string

  @ApiProperty({ required: false, description: "Badge description" })
  description?: string

  @ApiProperty({ required: false, description: "Badge image URL" })
  imageUrl?: string

  @ApiProperty({ required: false, description: "Reward amount" })
  rewardAmount?: number

  @ApiProperty({ description: "Whether badge is active" })
  isActive: boolean

  @ApiProperty({ description: "Creation date" })
  createdAt: Date

  @ApiProperty({ description: "Last update date" })
  updatedAt: Date
}

export class DegenBadgeStatsDto {
  @ApiProperty({ description: "Total badges earned" })
  totalBadges: number

  @ApiProperty({ description: "Badges by type" })
  badgesByType: Record<DegenBadgeType, number>

  @ApiProperty({ description: "Badges by rarity" })
  badgesByRarity: Record<DegenBadgeRarity, number>

  @ApiProperty({ description: "Total reward amount earned" })
  totalRewards: number

  @ApiProperty({ description: "Most recent badge" })
  latestBadge?: DegenBadgeResponseDto

  @ApiProperty({ description: "Rarest badge owned" })
  rarestBadge?: DegenBadgeResponseDto
}
