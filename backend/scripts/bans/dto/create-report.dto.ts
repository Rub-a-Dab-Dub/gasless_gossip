import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ReportType } from '../entities/report.entity';

export class CreateReportDto {
  @IsUUID()
  @IsNotEmpty()
  reportedUserId: string;

  @IsEnum(ReportType)
  type: ReportType;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Report reason must be at least 10 characters long' })
  @MaxLength(1000, { message: 'Report reason cannot exceed 1000 characters' })
  @Transform(({ value }) => value?.trim())
  reason: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Evidence cannot exceed 2000 characters' })
  evidence?: string;
}