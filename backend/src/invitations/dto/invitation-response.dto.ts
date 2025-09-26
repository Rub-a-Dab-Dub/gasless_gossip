import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Exclude, Expose, Type } from "class-transformer"
import { InvitationStatus } from "../entities/invitation.entity"

export class UserSummaryDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  username: string

  @ApiProperty()
  avatar?: string
}

export class InvitationResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  roomId: string

  @ApiProperty()
  code: string

  @ApiPropertyOptional()
  message?: string

  @ApiProperty({ enum: InvitationStatus })
  status: InvitationStatus

  @ApiProperty()
  expiresAt: Date

  @ApiPropertyOptional()
  acceptedAt?: Date

  @ApiProperty()
  usageCount: number

  @ApiProperty()
  maxUsage: number

  @ApiProperty()
  remainingUses: number

  @ApiProperty()
  isExpired: boolean

  @ApiProperty()
  isUsable: boolean

  @ApiProperty({ type: UserSummaryDto })
  @Type(() => UserSummaryDto)
  inviter: UserSummaryDto

  @ApiPropertyOptional({ type: UserSummaryDto })
  @Type(() => UserSummaryDto)
  invitee?: UserSummaryDto

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiPropertyOptional()
  metadata?: Record<string, any>

  // Generate shareable link
  @ApiProperty()
  @Expose()
  get shareableLink(): string {
    return `${process.env.FRONTEND_URL || "https://whisper.app"}/join/${this.code}`
  }

  // Hide sensitive data
  @Exclude()
  stellarTxId?: string
}
