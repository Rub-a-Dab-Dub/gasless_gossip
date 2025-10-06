import { AuditLogService } from './audit-log.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
export declare class AuditLogController {
    private readonly auditLogService;
    constructor(auditLogService: AuditLogService);
    create(createAuditLogDto: CreateAuditLogDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateAuditLogDto: UpdateAuditLogDto): string;
    remove(id: string): string;
}
