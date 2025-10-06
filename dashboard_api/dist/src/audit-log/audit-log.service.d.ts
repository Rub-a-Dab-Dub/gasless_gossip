import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
export declare class AuditLogService {
    create(createAuditLogDto: CreateAuditLogDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAuditLogDto: UpdateAuditLogDto): string;
    remove(id: number): string;
}
