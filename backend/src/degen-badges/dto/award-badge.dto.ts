import { IsEnum, IsUUID, IsObject, IsOptional, IsNumber, IsBoolean } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { DegenBadgeType } from "../entities/degen-badge.entity"

export class AwardBadgeDto {
  @ApiProperty({ description: "User ID to award badge to" })
  @IsUUID()
  userId: string

  @ApiProperty({ enum: DegenBadgeType, description: "Type of degen badge to award" })
  @IsEnum(DegenBadgeType)
  badgeType: DegenBadgeType

  @ApiProperty({ required: false, description: "Achievement data that triggered the badge" })
  @IsOptional()
  @IsObject()
  achievementData?: {
    amount?: number
    streakLength?: number
    riskLevel?: number
    timestamp?: Date
    metadata?: Record<string, any>
  }

  @ApiProperty({ required: false, description: "Whether to mint Stellar token immediately" })
  @IsOptional()
  @IsBoolean()
  mintToken?: boolean

  @ApiProperty({ required: false, description: "Custom reward amount override" })
  @IsOptional()
  @IsNumber()
  customRewardAmount?: number
}

export class BatchAwardBadgeDto {
  @ApiProperty({ description: "User IDs to award badges to" })
  @IsUUID(undefined, { each: true })
  userIds: string[]

  @ApiProperty({ enum: DegenBadgeType, description: "Type of degen badge to award" })
  @IsEnum(DegenBadgeType)
  badgeType: DegenBadgeType

  @ApiProperty({ required: false, description: "Whether to mint Stellar tokens" })
  @IsOptional()
  @IsBoolean()
  mintTokens?: boolean
}
