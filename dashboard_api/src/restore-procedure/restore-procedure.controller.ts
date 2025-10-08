import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from '../shared/guards/admin.guard';
import { RestoreProcedureService } from './restore-procedure.service';
import { CreateBackupDto, RestoreBackupDto, PruneBackupsDto } from './dto';

@ApiTags('restore-procedure')
@Controller('restore-procedure')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class RestoreProcedureController {
  constructor(private readonly restoreProcedureService: RestoreProcedureService) {}

  @Post('backup')
  @ApiOperation({ summary: 'Create a new backup' })
  @ApiResponse({ status: 201, description: 'Backup created successfully' })
  async createBackup(@Body(ValidationPipe) createBackupDto: CreateBackupDto) {
    return this.restoreProcedureService.createBackup(createBackupDto.dryRun);
  }

  @Get('backups')
  @ApiOperation({ summary: 'List all backups' })
  @ApiResponse({ status: 200, description: 'List of backups retrieved' })
  async listBackups() {
    return this.restoreProcedureService.listBackups();
  }

  @Post('backups/:id/verify')
  @ApiOperation({ summary: 'Verify backup integrity' })
  @ApiResponse({ status: 200, description: 'Backup verification results' })
  async verifyBackup(@Param('id') backupId: string) {
    return this.restoreProcedureService.verifyBackup(backupId);
  }

  @Post('backups/:id/restore')
  @ApiOperation({ summary: 'Restore from backup' })
  @ApiResponse({ status: 200, description: 'Backup restored successfully' })
  async restoreBackup(
    @Param('id') backupId: string,
    @Body(ValidationPipe) restoreBackupDto: RestoreBackupDto,
  ) {
    return this.restoreProcedureService.restoreBackup(
      backupId,
      restoreBackupDto.dryRun,
    );
  }

  @Delete('backups/prune')
  @ApiOperation({ summary: 'Prune old backups' })
  @ApiResponse({ status: 200, description: 'Old backups pruned successfully' })
  async pruneBackups(@Body(ValidationPipe) pruneBackupsDto: PruneBackupsDto) {
    return this.restoreProcedureService.pruneOldBackups(
      pruneBackupsDto.retentionDays,
    );
  }
}