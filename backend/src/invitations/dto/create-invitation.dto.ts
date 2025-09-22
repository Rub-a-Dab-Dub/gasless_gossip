import { IsUUID, IsOptional, IsString, IsDateString, IsInt, Min, Max, IsEnum, IsObject } from "class-validator"
import { Transform } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export enum InvitationDuration {
  ONE_HOUR = "1h",
  SIX_HOURS = "6h",
  ONE_DAY = "1d",
  THREE_DAYS = "3d",
  ONE_WEEK = "7d",
  ONE_MONTH = "30d",
  CUSTOM = "custom",
}

export class CreateInvitationDto {
  @ApiProperty({ description: "ID of the room to invite to" })
  @IsUUID(4, { message: "Room ID must be a valid UUID" })
  roomId: string

  @ApiPropertyOptional({ description: "Optional message to include with invitation" })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  message?: string

  @ApiPropertyOptional({
    enum: InvitationDuration,
    description: "Duration before invitation expires",
    default: InvitationDuration.ONE_DAY,
  })
  @IsOptional()
  @IsEnum(InvitationDuration)
  duration?: InvitationDuration = InvitationDuration.ONE_DAY

  @ApiPropertyOptional({ description: "Custom expiry date (required if duration is custom)" })
  @IsOptional()
  @IsDateString()
  customExpiry?: string

  @ApiPropertyOptional({
    description: "Maximum number of times this invitation can be used",
    minimum: 1,
    maximum: 100,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1, { message: "Max usage must be at least 1" })
  @Max(100, { message: "Max usage cannot exceed 100" })
  maxUsage?: number = 1

  @ApiPropertyOptional({ description: "Additional metadata for the invitation" })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>
}
