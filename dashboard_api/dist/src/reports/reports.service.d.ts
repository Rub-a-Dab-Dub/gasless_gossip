import { Repository } from 'typeorm';
import { BulkReport } from './entities/bulk-report.entity';
import { CreateBulkReportDto } from './dto/create-bulk-report.dto';
import { User } from '../user/entities/user.entity';
import { Room } from '../../entities/room.entity';
import { Message } from '../../entities/message.entity';
import { Readable } from 'stream';
export declare class ReportsService {
    private bulkReportRepository;
    private userRepository;
    private roomRepository;
    private messageRepository;
    private readonly MAX_FILE_SIZE;
    constructor(bulkReportRepository: Repository<BulkReport>, userRepository: Repository<User>, roomRepository: Repository<Room>, messageRepository: Repository<Message>);
    createBulkReport(adminId: string, dto: CreateBulkReportDto): Promise<BulkReport>;
    getReportStatus(reportId: string): Promise<BulkReport>;
    getReports(adminId: string): Promise<BulkReport[]>;
    private processReportAsync;
    private updateReportStatus;
    private aggregateData;
    private generateFile;
    createDownloadStream(filePath: string): Readable;
}
