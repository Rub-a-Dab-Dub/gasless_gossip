import { IsString, IsUUID, IsOptional, IsInt, Min, Max, IsIP, IsUrl } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateVisitDto {
  @ApiProperty({
    description!: "Room identifier",
    example!: "room-123",
  })
  @IsString()
  roomId: string

  @ApiProperty({
    description: "User identifier",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsUUID()
  userId: string

  @ApiPropertyOptional({
    description: "IP address of the visitor",
    example: "192.168.1.1",
  })
  @IsOptional()
  @IsIP()
  ipAddress?: string

  @ApiPropertyOptional({
    description: "User agent string",
    example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  })
  @IsOptional()
  @IsString()
  userAgent?: string

  @ApiPropertyOptional({
    description: "Referrer URL",
    example: "https://example.com/previous-page",
  })
  @IsOptional()
  @IsUrl()
  referrer?: string

  @ApiPropertyOptional({
    description: "Visit duration in seconds",
    example: 300,
    minimum: 1,
    maximum: 86400,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(86400) // Max 24 hours
  duration?: number
}
