import { IsOptional, IsString, IsDateString, IsBoolean, IsIn } from "class-validator"

export class QueryAuditDto {
  @IsOptional()
  @IsString()
  userId?: string

  @IsOptional()
  @IsString()
  questId?: string

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsOptional()
  @IsBoolean()
  isFlagged?: boolean

  @IsOptional()
  @IsBoolean()
  isReversed?: boolean

  @IsOptional()
  @IsIn(["pending", "investigating", "resolved", "false_positive"])
  alertStatus?: string

  @IsOptional()
  @IsString()
  severity?: string
}
