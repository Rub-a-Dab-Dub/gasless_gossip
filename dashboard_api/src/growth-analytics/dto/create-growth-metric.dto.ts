import { IsUUID, IsDate, IsInt, IsOptional, IsBoolean, Min } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateGrowthMetricDto {
  @ApiProperty({ description: "User ID", example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsUUID()
  userId: string

  @ApiPropertyOptional({ description: "Cohort ID", example: "cohort-2025-01" })
  @IsOptional()
  cohortId?: string

  @ApiProperty({ description: "Metric date", example: "2025-10-06" })
  @IsDate()
  @Type(() => Date)
  metricDate: Date

  @ApiProperty({ description: "User level", example: 5, minimum: 0 })
  @IsInt()
  @Min(0)
  userLevel: number

  @ApiProperty({ description: "Number of unlocks", example: 3, minimum: 0 })
  @IsInt()
  @Min(0)
  unlocksCount: number

  @ApiPropertyOptional({ description: "Drop-off point level", example: 10 })
  @IsOptional()
  @IsInt()
  @Min(0)
  dropOffPoint?: number

  @ApiPropertyOptional({ description: "Session duration in seconds", example: 3600 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sessionDuration?: number

  @ApiPropertyOptional({ description: "Is user active", example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
