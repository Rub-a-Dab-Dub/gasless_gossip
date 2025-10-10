import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BulkActionsService } from './bulk-actions.service';
import { BulkActionPreviewDto, BulkActionExecuteDto, BulkActionResultDto } from './dto/bulk-action.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Bulk User Actions')
@ApiBearerAuth()
@Controller('users/bulk')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class BulkActionsController {
  constructor(private readonly bulkActionsService: BulkActionsService) {}

  @Post('preview')
  @ApiOperation({ summary: 'Preview bulk action effects' })
  @ApiResponse({ status: 200, description: 'Preview generated' })
  async preview(@Body() dto: BulkActionPreviewDto) {
    return this.bulkActionsService.preview(dto);
  }

  @Post('execute')
  @ApiOperation({ summary: 'Execute bulk action on users' })
  @ApiResponse({ status: 200, type: BulkActionResultDto })
  async execute(@Body() dto: BulkActionExecuteDto, @Request() req): Promise<BulkActionResultDto> {
    return this.bulkActionsService.execute(dto, req.user.id);
  }

  @Post('undo/:batchId')
  @ApiOperation({ summary: 'Undo last bulk action batch' })
  @ApiResponse({ status: 200, type: BulkActionResultDto })
  async undo(@Param('batchId') batchId: string, @Request() req): Promise<BulkActionResultDto> {
    return this.bulkActionsService.undoLastBatch(batchId, req.user.id);
  }

  @Get('history/:batchId')
  @ApiOperation({ summary: 'Get batch execution results' })
  async getBatchHistory(@Param('batchId') batchId: string) {
    return this.bulkActionsService.getBatchHistory(batchId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get recent batch history' })
  async getRecentBatches() {
    return this.bulkActionsService.getRecentBatches();
  }
}

// ==================== MODULE ====================

// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { User } from './entities/user.entity';
import { BulkActionHistory } from './entities/bulk-action-history.entity';
import { BulkActionsService } from './bulk-actions.service';
import { BulkActionsController } from './bulk-actions.controller';
import { BulkActionListener } from './listeners/bulk-action.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BulkActionHistory]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [BulkActionsController],
  providers: [BulkActionsService, BulkActionListener],
  exports: [BulkActionsService],
})
export class UsersModule {}

