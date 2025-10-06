import { IsOptional, IsString, IsNumber, IsIn } from "class-validator"

export class QueryLeaderboardDto {
  @IsOptional()
  @IsIn(["overall", "daily", "weekly", "monthly", "high_roller", "risk_taker"])
  category?: string

  @IsOptional()
  @IsString()
  cycleId?: string

  @IsOptional()
  @IsNumber()
  limit?: number

  @IsOptional()
  @IsNumber()
  minScore?: number

  @IsOptional()
  @IsString()
  userId?: string
}
