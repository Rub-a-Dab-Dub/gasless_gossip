import { IsString, IsNumber, IsBoolean, IsObject, IsOptional, IsDateString } from "class-validator"

export class CreateXpRuleDto {
  @IsString()
  ruleName: string

  @IsString()
  ruleType: string

  @IsOptional()
  @IsString()
  description?: string

  @IsNumber()
  multiplier: number

  @IsNumber()
  baseAmount: number

  @IsOptional()
  @IsObject()
  conditions?: Record<string, any>

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsNumber()
  priority?: number

  @IsOptional()
  @IsString()
  scope?: string

  @IsOptional()
  @IsString()
  abTestGroup?: string

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsOptional()
  @IsString()
  createdBy?: string
}
