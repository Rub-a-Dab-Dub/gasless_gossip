// ==================== DTOs ====================

// src/users/dto/bulk-action.dto.ts
import { IsArray, IsEnum, IsBoolean, IsOptional, IsString, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum BulkActionType {
  BAN = 'ban',
  UNBAN = 'unban',
  MIGRATE = 'migrate',
  DELETE = 'delete',
  UPDATE_ROLE = 'update_role',
}

export class BulkActionPreviewDto {
  @ApiProperty({ type: [String], description: 'Array of user IDs' })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  userIds: string[];

  @ApiProperty({ enum: BulkActionType })
  @IsEnum(BulkActionType)
  action: BulkActionType;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class BulkActionExecuteDto extends BulkActionPreviewDto {
  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  dryRun?: boolean = false;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  sendNotifications?: boolean = true;
}

export class BulkActionResultDto {
  batchId: string;
  action: BulkActionType;
  totalUsers: number;
  successful: number;
  failed: number;
  dryRun: boolean;
  executionTime: number;
  errors: Array<{ userId: string; error: string }>;
  timestamp: Date;
}

// ==================== ENTITIES ====================

// src/users/entities/bulk-action-history.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('bulk_action_history')
export class BulkActionHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: BulkActionType })
  action: BulkActionType;

  @Column('simple-array')
  userIds: string[];

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'int' })
  successful: number;

  @Column({ type: 'int' })
  failed: number;

  @Column('jsonb', { nullable: true })
  errors: Array<{ userId: string; error: string }>;

  @Column({ type: 'int' })
  executionTime: number;

  @Column({ default: false })
  dryRun: boolean;

  @Column({ type: 'uuid' })
  executedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}

// ==================== SERVICE ====================

// src/users/bulk-actions.service.ts
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { User } from './entities/user.entity';
import { BulkActionHistory } from './entities/bulk-action-history.entity';
import { BulkActionExecuteDto, BulkActionResultDto, BulkActionType } from './dto/bulk-action.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BulkActionsService {
  private readonly logger = new Logger(BulkActionsService.name);
  private readonly BATCH_SIZE = 100; // Process in chunks for performance

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(BulkActionHistory)
    private historyRepository: Repository<BulkActionHistory>,
    private dataSource: DataSource,
    private eventEmitter: EventEmitter2,
  ) {}

  async preview(dto: BulkActionExecuteDto) {
    const startTime = Date.now();

    // Validate users exist
    const users = await this.userRepository.find({
      where: { id: In(dto.userIds) },
      select: ['id', 'email', 'status', 'role'],
    });

    const foundIds = new Set(users.map(u => u.id));
    const notFound = dto.userIds.filter(id => !foundIds.has(id));

    // Simulate action effects
    const affectedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      currentStatus: user.status,
      currentRole: user.role,
      newStatus: this.getNewStatus(user, dto.action),
      newRole: dto.metadata?.role || user.role,
    }));

    return {
      totalRequested: dto.userIds.length,
      foundUsers: users.length,
      notFoundUsers: notFound,
      affectedUsers,
      estimatedTime: Math.ceil((users.length / 1000) * 10), // Estimate based on requirement
      action: dto.action,
      warnings: this.getWarnings(users, dto.action),
      previewTime: Date.now() - startTime,
    };
  }

  async execute(dto: BulkActionExecuteDto, executedBy: string): Promise<BulkActionResultDto> {
    const startTime = Date.now();
    const batchId = this.generateBatchId();

    this.logger.log(`Starting bulk action ${dto.action} for ${dto.userIds.length} users. Batch: ${batchId}, DryRun: ${dto.dryRun}`);

    let successful = 0;
    let failed = 0;
    const errors: Array<{ userId: string; error: string }> = [];

    if (dto.dryRun) {
      // Dry run - just validate
      const preview = await this.preview(dto);
      return {
        batchId,
        action: dto.action,
        totalUsers: dto.userIds.length,
        successful: preview.foundUsers,
        failed: preview.notFoundUsers.length,
        dryRun: true,
        executionTime: Date.now() - startTime,
        errors: preview.notFoundUsers.map(id => ({ userId: id, error: 'User not found' })),
        timestamp: new Date(),
      };
    }

    // Process in transaction with batching for performance
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Process in chunks to avoid memory issues
      for (let i = 0; i < dto.userIds.length; i += this.BATCH_SIZE) {
        const chunk = dto.userIds.slice(i, i + this.BATCH_SIZE);
        
        const users = await queryRunner.manager.find(User, {
          where: { id: In(chunk) },
          lock: { mode: 'pessimistic_write' }, // Lock rows for update
        });

        for (const user of users) {
          try {
            await this.executeAction(user, dto.action, dto.metadata, queryRunner.manager);
            successful++;
          } catch (error) {
            failed++;
            errors.push({ userId: user.id, error: error.message });
            this.logger.error(`Failed to process user ${user.id}: ${error.message}`);
          }
        }

        // Handle not found users in this chunk
        const foundIds = new Set(users.map(u => u.id));
        const notFoundInChunk = chunk.filter(id => !foundIds.has(id));
        failed += notFoundInChunk.length;
        notFoundInChunk.forEach(id => {
          errors.push({ userId: id, error: 'User not found' });
        });
      }

      // Save history
      const history = this.historyRepository.create({
        id: batchId,
        action: dto.action,
        userIds: dto.userIds,
        metadata: dto.metadata,
        successful,
        failed,
        errors,
        executionTime: Date.now() - startTime,
        dryRun: false,
        executedBy,
      });

      await queryRunner.manager.save(history);
      await queryRunner.commitTransaction();

      // Emit event for notifications (async, non-blocking)
      if (dto.sendNotifications) {
        this.eventEmitter.emit('bulk-action.completed', {
          batchId,
          action: dto.action,
          successful,
          failed,
          executedBy,
        });
      }

      this.logger.log(`Bulk action ${batchId} completed. Success: ${successful}, Failed: ${failed}, Time: ${Date.now() - startTime}ms`);

      return {
        batchId,
        action: dto.action,
        totalUsers: dto.userIds.length,
        successful,
        failed,
        dryRun: false,
        executionTime: Date.now() - startTime,
        errors,
        timestamp: new Date(),
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Bulk action failed, rolled back: ${error.message}`);
      throw new BadRequestException(`Bulk action failed: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async undoLastBatch(batchId: string, executedBy: string): Promise<BulkActionResultDto> {
    const history = await this.historyRepository.findOne({ where: { id: batchId } });
    
    if (!history) {
      throw new BadRequestException('Batch not found');
    }

    if (history.dryRun) {
      throw new BadRequestException('Cannot undo a dry run');
    }

    // Create reverse action
    const reverseAction = this.getReverseAction(history.action);
    
    return this.execute({
      userIds: history.userIds.filter(id => 
        !history.errors.some(e => e.userId === id)
      ), // Only undo successful ones
      action: reverseAction,
      metadata: history.metadata,
      dryRun: false,
      sendNotifications: true,
    }, executedBy);
  }

  async getBatchHistory(batchId: string): Promise<BulkActionHistory> {
    const history = await this.historyRepository.findOne({ where: { id: batchId } });
    if (!history) {
      throw new BadRequestException('Batch not found');
    }
    return history;
  }

  async getRecentBatches(limit: number = 10): Promise<BulkActionHistory[]> {
    return this.historyRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // ==================== PRIVATE HELPERS ====================

  private async executeAction(user: User, action: BulkActionType, metadata: any, manager: any) {
    switch (action) {
      case BulkActionType.BAN:
        user.status = 'banned';
        user.bannedAt = new Date();
        break;
      case BulkActionType.UNBAN:
        user.status = 'active';
        user.bannedAt = null;
        break;
      case BulkActionType.MIGRATE:
        user.migratedTo = metadata?.targetSystem;
        user.status = 'migrated';
        break;
      case BulkActionType.DELETE:
        await manager.softRemove(user);
        return;
      case BulkActionType.UPDATE_ROLE:
        user.role = metadata?.role;
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    await manager.save(user);
  }

  private getNewStatus(user: User, action: BulkActionType): string {
    switch (action) {
      case BulkActionType.BAN: return 'banned';
      case BulkActionType.UNBAN: return 'active';
      case BulkActionType.MIGRATE: return 'migrated';
      case BulkActionType.DELETE: return 'deleted';
      default: return user.status;
    }
  }

  private getReverseAction(action: BulkActionType): BulkActionType {
    switch (action) {
      case BulkActionType.BAN: return BulkActionType.UNBAN;
      case BulkActionType.UNBAN: return BulkActionType.BAN;
      default: throw new BadRequestException(`Action ${action} cannot be reversed`);
    }
  }

  private getWarnings(users: User[], action: BulkActionType): string[] {
    const warnings: string[] = [];
    
    if (action === BulkActionType.DELETE) {
      warnings.push('⚠️ This action is irreversible');
    }

    const adminCount = users.filter(u => u.role === 'admin').length;
    if (adminCount > 0 && action === BulkActionType.BAN) {
      warnings.push(`⚠️ ${adminCount} admin(s) will be affected`);
    }

    return warnings;
  }

  private generateBatchId(): string {
    return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ==================== CONTROLLER ====================

// src/users/bulk-actions.controller.ts
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

// ==================== EVENT LISTENER (for notifications) ====================

// src/users/listeners/bulk-action.listener.ts
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class BulkActionListener {
  private readonly logger = new Logger(BulkActionListener.name);

  @OnEvent('bulk-action.completed', { async: true })
  async handleBulkActionCompleted(payload: any) {
    this.logger.log(`Processing notifications for batch ${payload.batchId}`);
    
    // Queue notifications (integrate with your notification service)
    // Example: await this.notificationService.queueBulkNotification(payload);
    
    // This runs asynchronously and doesn't block the response
    await this.simulateNotificationQueue(payload);
  }

  private async simulateNotificationQueue(payload: any) {
    // Simulate sending notifications to affected users
    // In production, use Bull, RabbitMQ, or AWS SQS
    this.logger.log(`Queued ${payload.successful} notifications for batch ${payload.batchId}`);
  }
}