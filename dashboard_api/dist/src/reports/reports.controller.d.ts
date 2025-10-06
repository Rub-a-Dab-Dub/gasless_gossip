import { Response } from 'express';
import { ReportsService } from './reports.service';
import { CreateBulkReportDto } from './dto/create-bulk-report.dto';
import { BulkReport } from './entities/bulk-report.entity';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    createBulkReport(createBulkReportDto: CreateBulkReportDto, adminId: string): Promise<BulkReport>;
    getReports(adminId: string): Promise<BulkReport[]>;
    getReportStatus(id: string): Promise<BulkReport>;
    downloadReport(id: string, adminId: string, res: Response): Promise<void>;
}
