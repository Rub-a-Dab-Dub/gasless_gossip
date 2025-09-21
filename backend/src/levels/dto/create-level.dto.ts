import { IsUUID, IsOptional, IsNumber, Min } from "class-validator"

export class CreateLevelDto {
  @IsUUID()
  userId!: string

  @IsOptional()
  @IsNumber()
  @Min(1)
  level?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentXp?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalXp?: number
}
