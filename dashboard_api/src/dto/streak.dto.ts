import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateStreakDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  streakType?: string;
}

export class UpdateStreakDto {
  @IsOptional()
  @IsNumber()
  currentStreak?: number;

  @IsOptional()
  @IsNumber()
  longestStreak?: number;

  @IsOptional()
  @IsNumber()
  multiplier?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class StreakResponseDto {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  multiplier: number;
  streakType: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}