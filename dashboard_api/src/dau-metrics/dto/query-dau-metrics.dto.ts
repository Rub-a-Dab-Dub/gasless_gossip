import { IsOptional, IsString, IsDateString, IsInt, Min } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"

export class QueryDauMetricsDto {
  @ApiPropertyOptional({ description: "Feature name filter", example: "chat" })
  @IsString()
  @IsOptional()
  featureName?: string

  @ApiPropertyOptional({ description: "Start date (YYYY-MM-DD)", example: "2025-09-01" })
  @IsDateString()
  @IsOptional()
  startDate?: string

  @ApiPropertyOptional({ description: "End date (YYYY-MM-DD)", example: "2025-10-06" })
  @IsDateString()
  @IsOptional()
  endDate?: string

  @ApiPropertyOptional({ description: "Timezone filter", example: "America/New_York" })
  @IsString()
  @IsOptional()
  timezone?: string

  @ApiPropertyOptional({ description: "Page number", example: 1, default: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number

  @ApiPropertyOptional({ description: "Items per page", example: 50, default: 50 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number
}
