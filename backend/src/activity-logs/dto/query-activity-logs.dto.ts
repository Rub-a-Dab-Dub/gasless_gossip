import { IsOptional, IsEnum, IsDateString, IsString, IsUUID, IsInt, Min, Max } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { ActivityAction } from "../entities/activity-log.entity"

export class QueryActivityLogsDto {
  @ApiPropertyOptional({
    enum: ActivityAction,
    description: "Filter by action type",
  })
  @IsOptional()
  @IsEnum(ActivityAction)
  action?: ActivityAction

  @ApiPropertyOptional({ description: "Filter by room ID" })
  @IsOptional()
  @IsString()
  roomId?: string

  @ApiPropertyOptional({ description: "Filter by target user ID" })
  @IsOptional()
  @IsUUID()
  targetUserId?: string

  @ApiPropertyOptional({ description: "Start date for filtering (ISO string)" })
  @IsOptional()
  @IsDateString()
  startDate?: string

  @ApiPropertyOptional({ description: "End date for filtering (ISO string)" })
  @IsOptional()
  @IsDateString()
  endDate?: string

  @ApiPropertyOptional({
    description: "Page number for pagination",
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({
    description: "Number of items per page",
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20
}
