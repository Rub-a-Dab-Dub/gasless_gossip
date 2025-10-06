import { Repository } from 'typeorm';
import { Ban } from './entities/ban.entity';
import { Report, ReportStatus } from './entities/report.entity';
import { CreateBanDto } from './dto/create-ban.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { BanCheckResponseDto } from './dto/ban-check-response.dto';
export declare class BansService {
    private banRepository;
    private reportRepository;
    constructor(banRepository: Repository<Ban>, reportRepository: Repository<Report>);
    createBan(createBanDto: CreateBanDto): Promise<Ban>;
    getBanByUserId(userId: string): Promise<BanCheckResponseDto>;
    getAllBans(page?: number, limit?: number): Promise<{
        data: Ban[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    liftBan(banId: string, liftedBy?: string): Promise<void>;
    isUserBanned(userId: string): Promise<boolean>;
    private getActiveBan;
    createReport(reporterId: string, createReportDto: CreateReportDto): Promise<Report>;
    getReports(page?: number, limit?: number, status?: ReportStatus): Promise<{
        data: Report[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getReportById(id: string): Promise<Report>;
    updateReport(id: string, updateReportDto: UpdateReportDto): Promise<Report>;
    getUserReports(userId: string, page?: number, limit?: number): Promise<{
        data: Report[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    private notifyUserBanned;
    private notifyUserBanLifted;
}
