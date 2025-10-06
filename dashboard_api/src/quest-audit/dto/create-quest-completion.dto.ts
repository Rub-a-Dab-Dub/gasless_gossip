import { IsString, IsNumber, IsObject, IsOptional, IsDateString } from "class-validator"

export class CreateQuestCompletionDto {
  @IsString()
  userId: string

  @IsString()
  questId: string

  @IsString()
  questName: string

  @IsNumber()
  rewardAmount: number

  @IsString()
  rewardType: string

  @IsDateString()
  completedAt: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>

  @IsString()
  @IsOptional()
  ipAddress?: string

  @IsString()
  @IsOptional()
  userAgent?: string
}
