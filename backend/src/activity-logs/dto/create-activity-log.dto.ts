import { IsEnum, IsOptional, IsString, IsUUID, IsNumber, IsObject, IsIP } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { ActivityAction } from "../entities/activity-log.entity"

export class CreateActivityLogDto {
  @ApiProperty({ description: "User ID performing the action" })
  @IsUUID()
  userId: string

  @ApiProperty({
    enum: ActivityAction,
    description: "Type of action performed",
    example: ActivityAction.MESSAGE_SENT,
  })
  @IsEnum(ActivityAction)
  action: ActivityAction

  @ApiPropertyOptional({
    description: "Additional metadata for the action",
    example: { messageId: "uuid", content: "Hello world" },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>

  @ApiPropertyOptional({ description: "Room ID where action occurred" })
  @IsOptional()
  @IsString()
  roomId?: string

  @ApiPropertyOptional({ description: "Target user ID for the action" })
  @IsOptional()
  @IsUUID()
  targetUserId?: string

  @ApiPropertyOptional({
    description: "Amount involved in the action (e.g., tip amount)",
    example: 10.5,
  })
  @IsOptional()
  @IsNumber()
  amount?: number

  @ApiPropertyOptional({ description: "IP address of the user" })
  @IsOptional()
  @IsIP()
  ipAddress?: string

  @ApiPropertyOptional({ description: "User agent string" })
  @IsOptional()
  @IsString()
  userAgent?: string
}
