import { IsArray, IsEnum, IsOptional, IsObject, IsDateString, ArrayNotEmpty } from 'class-validator';
import { ReportFormat } from '../entities/bulk-report.entity';

export class CreateBulkReportDto {
  @IsArray()
  @ArrayNotEmpty()
  resources: string[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;

  @IsOptional()
  @IsEnum(ReportFormat)
  format?: ReportFormat;
}