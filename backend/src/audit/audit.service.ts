/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { AuditLog } from './entities/audit.entity';
import { CreateAuditLogDto } from './dto/create-audit.dto';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
  ) {}

  async createLog(dto: CreateAuditLogDto): Promise<AuditLog> {
    const log = this.auditLogRepo.create(dto);
    return this.auditLogRepo.save(log);
  }

  async findLogs(filter: FilterAuditLogDto): Promise<AuditLog[]> {
    const where: FindOptionsWhere<AuditLog> = {};
    if (filter.userId) where.userId = filter.userId;
    if (filter.action) where.action = filter.action;

    return this.auditLogRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }
}
