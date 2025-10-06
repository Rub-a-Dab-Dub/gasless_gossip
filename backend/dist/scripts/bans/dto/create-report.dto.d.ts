import { ReportType } from '../entities/report.entity';
export declare class CreateReportDto {
    reportedUserId: string;
    type: ReportType;
    reason: string;
    evidence?: string;
}
