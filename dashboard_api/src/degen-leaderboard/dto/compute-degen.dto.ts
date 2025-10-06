import { IsString, IsNumber, IsOptional, IsDateString } from "class-validator"

export class ComputeDegenDto {
  @IsString()
  userId: string

  @IsString()
  username: string

  @IsString()
  category: string

  @IsNumber()
  totalBets: number

  @IsNumber()
  totalWagered: number

  @IsNumber()
  totalWon: number

  @IsNumber()
  totalLost: number

  @IsOptional()
  @IsString()
  cycleId?: string

  @IsOptional()
  @IsDateString()
  cycleStartDate?: string

  @IsOptional()
  @IsDateString()
  cycleEndDate?: string
}
