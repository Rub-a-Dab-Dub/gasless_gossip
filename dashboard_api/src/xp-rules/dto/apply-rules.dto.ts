import { IsString, IsBoolean, IsOptional } from "class-validator"

export class ApplyRulesDto {
  @IsString()
  simulationId: string

  @IsOptional()
  @IsBoolean()
  notifyUsers?: boolean

  @IsOptional()
  @IsString()
  appliedBy?: string
}
