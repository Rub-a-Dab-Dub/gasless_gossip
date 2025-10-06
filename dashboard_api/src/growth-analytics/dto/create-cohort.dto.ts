import { IsString, IsDate, IsOptional, IsInt, Min } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateCohortDto {
  @ApiProperty({ description: "Cohort name", example: "Q1-2025-Users" })
  @IsString()
  cohortName: string

  @ApiProperty({ description: "Cohort start date", example: "2025-01-01" })
  @IsDate()
  @Type(() => Date)
  startDate: Date

  @ApiPropertyOptional({ description: "Cohort end date", example: "2025-03-31" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date

  @ApiPropertyOptional({ description: "Cohort description" })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: "Initial user count", example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  userCount?: number
}
