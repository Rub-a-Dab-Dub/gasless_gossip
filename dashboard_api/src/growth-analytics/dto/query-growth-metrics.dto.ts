import { IsOptional, IsUUID, IsDateString, IsInt, Min } from "class-validator"
import { Type } from "class-transformer"
import { ApiPropertyOptional } from "@nestjs/swagger"

export class QueryGrowthMetricsDto {
  @ApiPropertyOptional({ description: "User ID filter" })
  @IsOptional()
  @IsUUID()
  userId?: string

  @ApiPropertyOptional({ description: "Cohort ID filter" })
  @IsOptional()
  cohortId?: string

  @ApiPropertyOptional({ description: "Start date (ISO format)", example: "2025-01-01" })
  @IsOptional()
  @IsDateString()
  startDate?: string

  @ApiPropertyOptional({ description: "End date (ISO format)", example: "2025-12-31" })
  @IsOptional()
  @IsDateString()
  endDate?: string

  @ApiPropertyOptional({ description: "Page number", example: 1, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ description: "Items per page", example: 50, default: 50, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50
}
