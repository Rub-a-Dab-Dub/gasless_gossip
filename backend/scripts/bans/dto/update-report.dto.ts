import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ReportStatus } from '../entities/report.entity';

export class UpdateReportDto {
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @IsOptional()
  @IsUUID()
  reviewedBy?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Review notes cannot exceed 1000 characters' })
  reviewNotes?: string;
}