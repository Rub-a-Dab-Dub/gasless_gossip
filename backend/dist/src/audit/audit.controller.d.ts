import { AuditLogsService } from './audit.service';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';
export declare class AuditLogsController {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    getLogsByUser(userId: string, query: FilterAuditLogDto): Promise<import("./entities/audit.entity").AuditLog[]>;
}
