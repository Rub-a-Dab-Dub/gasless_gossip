import { IsString, IsInt, IsOptional, IsDateString, IsObject, Min } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateDauMetricDto {
  @ApiProperty({ description: "Date of the metric (YYYY-MM-DD)", example: "2025-10-06" })
  @IsDateString()
  metricDate: string

  @ApiProperty({ description: "Timezone for the metric", example: "America/New_York", default: "UTC" })
  @IsString()
  @IsOptional()
  timezone?: string

  @ApiProperty({ description: "Feature name", example: "chat" })
  @IsString()
  featureName: string

  @ApiProperty({ description: "Number of unique users", example: 150 })
  @IsInt()
  @Min(0)
  uniqueUsers: number

  @ApiProperty({ description: "Total number of sessions", example: 320 })
  @IsInt()
  @Min(0)
  totalSessions: number

  @ApiProperty({ description: "Total duration in seconds", example: 45600 })
  @IsInt()
  @Min(0)
  totalDurationSeconds: number

  @ApiProperty({ description: "Number of new users", example: 25 })
  @IsInt()
  @Min(0)
  newUsers: number

  @ApiProperty({ description: "Number of returning users", example: 125 })
  @IsInt()
  @Min(0)
  returningUsers: number

  @ApiPropertyOptional({ description: "Benchmark goal for this feature", example: 200 })
  @IsInt()
  @IsOptional()
  @Min(0)
  benchmarkGoal?: number

  @ApiPropertyOptional({ description: "Additional metadata", example: { platform: "web" } })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>
}
