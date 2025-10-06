import { IsString, IsUUID } from "class-validator"

export class AwardBadgeDto {
  @IsUUID()
  userId: string

  @IsString()
  badgeType: string

  @IsString()
  tier: string

  @IsString()
  awardedBy: string
}
