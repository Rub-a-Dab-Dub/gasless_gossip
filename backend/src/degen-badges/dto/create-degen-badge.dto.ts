import { IsEnum, IsUUID, IsObject, IsOptional, IsString, IsNumber, IsBoolean, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { DegenBadgeType, DegenBadgeRarity } from "../entities/degen-badge.entity"

class BadgeCriteriaDto {
  @ApiProperty({ required: false, description: "Minimum amount required" })
  @IsOptional()
  @IsNumber()
  minAmount?: number

  @ApiProperty({ required: false, description: "Required streak length" })
  @IsOptional()
  @IsNumber()
  streakLength?: number

  @ApiProperty({ required: false, description: "Risk level (1-10)" })
  @IsOptional()
  @IsNumber()
  riskLevel?: number

  @ApiProperty({ required: false, description: "Timeframe for criteria" })
  @IsOptional()
  @IsString()
  timeframe?: string

  @ApiProperty({ required: false, description: "Additional conditions" })
  @IsOptional()
  @IsString({ each: true })
  conditions?: string[]
}

export class CreateDegenBadgeDto {
  @ApiProperty({ description: "User ID to award badge to" })
  @IsUUID()
  userId: string

  @ApiProperty({ enum: DegenBadgeType, description: "Type of degen badge" })
  @IsEnum(DegenBadgeType)
  badgeType: DegenBadgeType

  @ApiProperty({ enum: DegenBadgeRarity, required: false, description: "Badge rarity" })
  @IsOptional()
  @IsEnum(DegenBadgeRarity)
  rarity?: DegenBadgeRarity

  @ApiProperty({ type: BadgeCriteriaDto, description: "Badge criteria" })
  @IsObject()
  @ValidateNested()
  @Type(() => BadgeCriteriaDto)
  criteria: BadgeCriteriaDto

  @ApiProperty({ required: false, description: "Badge description" })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ required: false, description: "Badge image URL" })
  @IsOptional()
  @IsString()
  imageUrl?: string

  @ApiProperty({ required: false, description: "Reward amount in tokens" })
  @IsOptional()
  @IsNumber()
  rewardAmount?: number

  @ApiProperty({ required: false, description: "Whether to mint Stellar token" })
  @IsOptional()
  @IsBoolean()
  mintStellarToken?: boolean
}
