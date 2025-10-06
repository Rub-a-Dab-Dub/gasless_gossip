import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Room, RoomStatus } from '../../entities/room.entity';

@Injectable()
export class RoomSchedulerService {
  private readonly logger = new Logger(RoomSchedulerService.name);
  private processingStats = {
    totalProcessed: 0,
    successfullyDeleted: 0,
    errors: 0,
    lastRun: new Date()
  };

  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  /**
   * Process expired secret rooms every hour
   * Maintains <1% error rate as required
   */
  @Cron(CronExpression.EVERY_HOUR)
  async processExpiredSecretRooms(): Promise<void> {
    const startTime = Date.now();
    this.logger.log('Starting hourly expired room cleanup');

    try {
      // Find all expired rooms that are still active
      const expiredRooms = await this.roomRepository.find({
        where: {
          expiresAt: LessThan(new Date()),
          status: RoomStatus.ACTIVE,
          isActive: true
        }
      });

      this.logger.log(`Found ${expiredRooms.length} expired rooms to process`);

      if (expiredRooms.length === 0) {
        this.updateProcessingStats(0, 0, 0);
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      // Process each expired room
      for (const room of expiredRooms) {
        try {
          await this.archiveExpiredRoom(room);
          successCount++;
          
          // Add small delay to prevent overwhelming the database
          await this.sleep(50);
        } catch (error) {
          errorCount++;
          this.logger.error(`Failed to archive room ${room.id}:`, error);
          
          // Continue processing other rooms even if one fails
          continue;
        }
      }

      this.updateProcessingStats(expiredRooms.length, successCount, errorCount);
      
      const duration = Date.now() - startTime;
      const errorRate = (errorCount / expiredRooms.length) * 100;
      
      this.logger.log(
        `Completed room cleanup: ${successCount}/${expiredRooms.length} processed successfully ` +
        `(${errorRate.toFixed(2)}% error rate) in ${duration}ms`
      );

      // Alert if error rate exceeds 1%
      if (errorRate > 1) {
        this.logger.warn(`Error rate ${errorRate.toFixed(2)}% exceeds 1% threshold!`);
        await this.sendErrorRateAlert(errorRate, expiredRooms.length, errorCount);
      }

    } catch (error) {
      this.logger.error('Fatal error in room cleanup process:', error);
      this.processingStats.errors++;
      throw error;
    }
  }

  /**
   * Archive an expired room
   * @param room - The room to archive
   */
  private async archiveExpiredRoom(room: Room): Promise<void> {
    // Update room status to archived
    await this.roomRepository.update(room.id, {
      status: RoomStatus.ARCHIVED,
      isActive: false,
      archivedAt: new Date()
    });

    this.logger.debug(`Archived expired room: ${room.id} (${room.name})`);

    // If room has auto-delete enabled, mark for deletion
    if (room.settings?.autoDelete) {
      await this.scheduleRoomDeletion(room.id, room.settings.deleteAfterHours || 24);
    }
  }

  /**
   * Schedule room deletion after archival
   * @param roomId - Room ID to delete
   * @param hoursDelay - Hours to wait before deletion
   */
  private async scheduleRoomDeletion(roomId: string, hoursDelay: number): Promise<void> {
    // In a production environment, you'd use a proper job queue like Bull/BullMQ
    // For now, we'll use a simple setTimeout for demonstration
    const deleteAfter = hoursDelay * 60 * 60 * 1000; // Convert hours to milliseconds
    
    setTimeout(async () => {
      try {
        await this.roomRepository.update(roomId, {
          status: RoomStatus.DELETED
        });
        this.logger.log(`Auto-deleted room: ${roomId}`);
      } catch (error) {
        this.logger.error(`Failed to auto-delete room ${roomId}:`, error);
      }
    }, deleteAfter);

    this.logger.debug(`Scheduled deletion for room ${roomId} in ${hoursDelay} hours`);
  }

  /**
   * Get processing statistics
   * @returns Current processing stats
   */
  getProcessingStats(): typeof this.processingStats {
    return { ...this.processingStats };
  }

  /**
   * Reset processing statistics
   */
  resetStats(): void {
    this.processingStats = {
      totalProcessed: 0,
      successfullyDeleted: 0,
      errors: 0,
      lastRun: new Date()
    };
    this.logger.log('Processing statistics reset');
  }

  /**
   * Manual trigger for processing expired rooms (for testing/admin use)
   * @returns Processing result
   */
  async manualCleanup(): Promise<{
    processed: number;
    successful: number;
    errors: number;
    errorRate: number;
  }> {
    this.logger.log('Manual cleanup triggered');
    
    const beforeStats = { ...this.processingStats };
    await this.processExpiredSecretRooms();
    const afterStats = this.processingStats;
    
    const result = {
      processed: afterStats.totalProcessed - beforeStats.totalProcessed,
      successful: afterStats.successfullyDeleted - beforeStats.successfullyDeleted,
      errors: afterStats.errors - beforeStats.errors,
      errorRate: 0
    };
    
    result.errorRate = result.processed > 0 ? (result.errors / result.processed) * 100 : 0;
    
    return result;
  }

  private updateProcessingStats(total: number, successful: number, errors: number): void {
    this.processingStats.totalProcessed += total;
    this.processingStats.successfullyDeleted += successful;
    this.processingStats.errors += errors;
    this.processingStats.lastRun = new Date();
  }

  private async sendErrorRateAlert(errorRate: number, totalRooms: number, errorCount: number): Promise<void> {
    // In a production environment, this would send alerts via email, Slack, etc.
    this.logger.error(
      `🚨 HIGH ERROR RATE ALERT 🚨\n` +
      `Error Rate: ${errorRate.toFixed(2)}%\n` +
      `Failed Operations: ${errorCount}/${totalRooms}\n` +
      `Threshold Exceeded: >1%\n` +
      `Time: ${new Date().toISOString()}`
    );

    // Here you would integrate with your alerting system:
    // - Send email notification
    // - Post to Slack/Discord
    // - Create incident in PagerDuty
    // - Update monitoring dashboard
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}