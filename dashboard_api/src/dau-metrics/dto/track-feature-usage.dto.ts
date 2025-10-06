import { IsString, IsUUID, IsOptional, IsBoolean, IsInt, IsObject, Min } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class TrackFeatureUsageDto {
  @ApiProperty({ description: "User ID", example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsUUID()
  userId: string

  @ApiProperty({ description: "Feature name", example: "chat" })
  @IsString()
  featureName: string

  @ApiPropertyOptional({ description: "Timezone", example: "America/New_York", default: "UTC" })
  @IsString()
  @IsOptional()
  timezone?: string

  @ApiPropertyOptional({ description: "Session ID", example: "sess_abc123" })
  @IsString()
  @IsOptional()
  sessionId?: string

  @ApiPropertyOptional({ description: "Duration in seconds", example: 120 })
  @IsInt()
  @Min(0)
  @IsOptional()
  durationSeconds?: number

  @ApiPropertyOptional({ description: "Is this a new user?", example: false })
  @IsBoolean()
  @IsOptional()
  isNewUser?: boolean

  @ApiPropertyOptional({ description: "Additional metadata", example: { action: "send_message" } })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>
}
