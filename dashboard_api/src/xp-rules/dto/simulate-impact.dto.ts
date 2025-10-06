import { IsString, IsArray, IsOptional } from "class-validator"

export class SimulateImpactDto {
  @IsString()
  simulationName: string

  @IsArray()
  ruleChanges: Array<{
    ruleId: string
    newMultiplier?: number
    newBaseAmount?: number
  }>

  @IsOptional()
  @IsString()
  createdBy?: string
}
