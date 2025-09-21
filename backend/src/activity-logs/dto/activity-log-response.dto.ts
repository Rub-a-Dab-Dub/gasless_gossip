import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { ActivityAction } from "../entities/activity-log.entity"

export class ActivityLogResponseDto {
  @ApiProperty({ description: "Activity log ID" })
  id: string

  @ApiProperty({ description: "User ID who performed the action" })
  userId: string

  @ApiProperty({
    enum: ActivityAction,
    description: "Type of action performed",
  })
  action: ActivityAction

  @ApiPropertyOptional({ description: "Additional metadata for the action" })
  metadata?: Record<string, any>

  @ApiPropertyOptional({ description: "Room ID where action occurred" })
  roomId?: string

  @ApiPropertyOptional({ description: "Target user ID for the action" })
  targetUserId?: string

  @ApiPropertyOptional({ description: "Amount involved in the action" })
  amount?: number

  @ApiProperty({ description: "Timestamp when action was performed" })
  createdAt: Date

  @ApiPropertyOptional({ description: "User information" })
  user?: {
    id: string
    username: string
    pseudonym?: string
  }

  @ApiPropertyOptional({ description: "Target user information" })
  targetUser?: {
    id: string
    username: string
    pseudonym?: string
  }
}
