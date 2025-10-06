import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit.entity';
import { CreateAuditLogDto } from './dto/create-audit.dto';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';
export declare class AuditLogsService {
    private readonly auditLogRepo;
    constructor(auditLogRepo: Repository<AuditLog>);
    createLog(dto: CreateAuditLogDto): Promise<AuditLog>;
    findLogs(filter: FilterAuditLogDto): Promise<AuditLog[]>;
}
