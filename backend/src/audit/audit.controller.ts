/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuditLogsService } from './audit.service';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get(':userId')
  async getLogsByUser(
    @Param('userId') userId: string,
    @Query() query: FilterAuditLogDto,
  ) {
    return this.auditLogsService.findLogs({ ...query, userId });
  }
}
