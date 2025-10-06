import { ReportFormat } from '../entities/bulk-report.entity';
export declare class CreateBulkReportDto {
    resources: string[];
    startDate?: string;
    endDate?: string;
    filters?: Record<string, any>;
    format?: ReportFormat;
}
