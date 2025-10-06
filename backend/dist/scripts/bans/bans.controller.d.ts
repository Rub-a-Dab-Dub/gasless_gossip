import { BansService } from './bans.service';
import { CreateBanDto } from './dto/create-ban.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportStatus } from './entities/report.entity';
export declare class BansController {
    private readonly bansService;
    constructor(bansService: BansService);
    createBan(createBanDto: CreateBanDto): Promise<import("./entities/ban.entity").Ban>;
    checkBanStatus(userId: string): Promise<import("./dto/ban-check-response.dto").BanCheckResponseDto>;
    getAllBans(page?: number, limit?: number): Promise<{
        data: import("./entities/ban.entity").Ban[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    liftBan(id: string): Promise<void>;
}
export declare class ReportsController {
    private readonly bansService;
    constructor(bansService: BansService);
    createReport(createReportDto: CreateReportDto): Promise<import("./entities/report.entity").Report>;
    getReports(page?: number, limit?: number, status?: ReportStatus): Promise<{
        data: import("./entities/report.entity").Report[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getReport(id: string): Promise<import("./entities/report.entity").Report>;
    updateReport(id: string, updateReportDto: UpdateReportDto): Promise<import("./entities/report.entity").Report>;
    getUserReports(userId: string, page?: number, limit?: number): Promise<{
        data: import("./entities/report.entity").Report[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
