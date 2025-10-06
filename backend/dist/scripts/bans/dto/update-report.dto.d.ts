import { ReportStatus } from '../entities/report.entity';
export declare class UpdateReportDto {
    status?: ReportStatus;
    reviewedBy?: string;
    reviewNotes?: string;
}
