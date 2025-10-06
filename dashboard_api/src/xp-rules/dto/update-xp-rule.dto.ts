import { IsString, IsNumber, IsBoolean, IsObject, IsOptional } from "class-validator"

export class UpdateXpRuleDto {
  @IsOptional()
  @IsNumber()
  multiplier?: number

  @IsOptional()
  @IsNumber()
  baseAmount?: number

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
  updatedBy?: string

  @IsOptional()
  @IsString()
  changeDescription?: string
}
