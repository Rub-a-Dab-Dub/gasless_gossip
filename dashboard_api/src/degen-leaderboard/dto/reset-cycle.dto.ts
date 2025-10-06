import { IsString, IsOptional } from "class-validator"

export class ResetCycleDto {
  @IsString()
  category: string

  @IsOptional()
  @IsString()
  newCycleId?: string
}
