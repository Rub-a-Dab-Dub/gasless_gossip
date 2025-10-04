import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SecretRoom } from '../entities/secret-room.entity';
import { SecretRoomsService } from './secret-rooms.service';

@Injectable()
export class SecretRoomSchedulerService {
  private readonly logger = new Logger(SecretRoomSchedulerService.name);
  private readonly maxErrorRate = 0.01; // 1% error rate threshold

  constructor(
    @InjectRepository(SecretRoom)
    private readonly secretRoomRepo: Repository<SecretRoom>,
    private readonly secretRoomsService: SecretRoomsService,
  ) {}

  /**
   * Process expired secret rooms every hour
   * Acceptance Criteria: Expiry jobs run hourly, deleting <1% error rate
   */
  @Cron(CronExpression.EVERY_HOUR)
  async processExpiredSecretRooms(): Promise<void> {
    this.logger.log('Starting hourly expired secret rooms cleanup...');
    
    const startTime = Date.now();
    let errorCount = 0;
    let successCount = 0;

    try {
      // Find expired rooms
      const expiredRooms = await this.secretRoomRepo.find({
        where: {
          expiresAt: LessThan(new Date()),
          status: 'active',
          isActive: true
        },
        select: ['id', 'name', 'creatorId', 'expiresAt', 'currentUsers']
      });

      this.logger.log(`Found ${expiredRooms.length} expired secret rooms to process`);

      if (expiredRooms.length === 0) {
        this.logger.log('No expired rooms to process');
        return;
      }

      // Process each expired room
      for (const room of expiredRooms) {
        try {
          await this.deleteExpiredRoom(room);
          successCount++;
          
          this.logger.debug(`Successfully deleted expired room: ${room.id} (${room.name})`);
        } catch (error) {
          errorCount++;
          this.logger.error(`Failed to delete expired room ${room.id}:`, error);
        }
      }

      // Calculate and report metrics
      const totalProcessed = expiredRooms.length;
      const errorRate = totalProcessed > 0 ? (errorCount / totalProcessed) : 0;
      const processingTime = Date.now() - startTime;

      this.logger.log(`Cleanup completed: ${successCount} succeeded, ${errorCount} failed, ${processingTime}ms`);

      // Alert if error rate exceeds threshold
      if (errorRate > this.maxErrorRate) {
        this.logger.warn(
          `HIGH ERROR RATE ALERT: ${(errorRate * 100).toFixed(2)}% failure rate exceeds ${(this.maxErrorRate * 100)}% threshold`
        );
      }

      // Report metrics for monitoring
      this.reportCleanupMetrics({
        totalProcessed,
        successCount,
        errorCount,
        errorRate,
        processingTime
      });

    } catch (error) {
      this.logger.error('Fatal error during expired rooms cleanup:', error);
    }
  }

  /**
   * Delete an expired room and handle cleanup
   */
  private async deleteExpiredRoom(room: SecretRoom): Promise<void> {
    // Award XP to creator for room activity before deletion
    if (room.currentUsers > 1) {
      await this.awardCreatorXpForActiveRoom(room);
    }

    // Notify room members before deletion
    await this.notifyRoomMembersOfExpiry(room.id);

    // Perform soft delete with audit trail
    await this.secretRoomRepo.update(room.id, {
      status: 'deleted',
      isActive: false,
      archivedAt: new Date(),
      metadata: {
        ...room.metadata,
        deletionReason: 'expired',
        deletedAt: new Date().toISOString(),
        finalUserCount: room.currentUsers
      }
    });

    this.logger.debug(`Room ${room.id} marked as deleted due to expiry`);
  }

  /**
   * Award bonus XP to room creator for active rooms
   */
  private async awardCreatorXpForActiveRoom(room: SecretRoom): Promise<void> {
    try {
      // Calculate XP based on room activity
      let xpAmount = 50; // Base XP for expired active room
      
      // Bonus for high participation
      if (room.currentUsers >= 10) {
        xpAmount += 25;
      }
      
      // Bonus for room trending score if available
      if (room.reactionMetrics?.trendingScore && room.reactionMetrics.trendingScore > 100) {
        xpAmount += Math.floor(room.reactionMetrics.trendingScore / 10);
      }

      // Apply room XP multiplier
      xpAmount = Math.floor(xpAmount * (1 + (room.xpMultiplier || 0) / 100));

      // Award XP to creator (mock implementation - integrate with actual XP service)
      this.logger.debug(`Awarding ${xpAmount} XP to creator ${room.creatorId} for active room ${room.id}`);
      
      // TODO: Integrate with actual XP service
      // await this.xpService.awardXp(room.creatorId, xpAmount, 'secret_room_expiry_bonus');
      
    } catch (error) {
      this.logger.error(`Failed to award XP to creator ${room.creatorId}:`, error);
    }
  }

  /**
   * Notify room members before deletion
   */
  private async notifyRoomMembersOfExpiry(roomId: string): Promise<void> {
    try {
      // TODO: Integrate with WebSocket gateway to notify active users
      // this.socketGateway.notifyRoomExpiry(roomId);
      
      this.logger.debug(`Notified members of room ${roomId} about expiry`);
    } catch (error) {
      this.logger.error(`Failed to notify members of room ${roomId}:`, error);
    }
  }

  /**
   * Report cleanup metrics for monitoring
   */
  private reportCleanupMetrics(metrics: {
    totalProcessed: number;
    successCount: number;
    errorCount: number;
    errorRate: number;
    processingTime: number;
  }): void {
    // TODO: Integrate with monitoring service (e.g., Prometheus, DataDog)
    this.logger.log(`Cleanup Metrics: ${JSON.stringify(metrics)}`);
  }

  /**
   * Manual cleanup trigger for testing/admin use
   */
  async triggerManualCleanup(): Promise<{ processed: number; errors: number }> {
    this.logger.log('Manual cleanup triggered');
    
    const beforeCount = await this.secretRoomRepo.count({
      where: { expiresAt: LessThan(new Date()), status: 'active' }
    });

    await this.processExpiredSecretRooms();

    const afterCount = await this.secretRoomRepo.count({
      where: { expiresAt: LessThan(new Date()), status: 'active' }
    });

    return {
      processed: beforeCount - afterCount,
      errors: afterCount // Remaining rooms indicate errors
    };
  }

  /**
   * Get cleanup statistics
   */
  async getCleanupStats(): Promise<{
    expiredRoomsCount: number;
    scheduledForDeletion: number;
    averageRoomLifespan: number;
  }> {
    const now = new Date();
    
    const [expiredCount, scheduledCount] = await Promise.all([
      this.secretRoomRepo.count({
        where: { expiresAt: LessThan(now), status: 'active' }
      }),
      this.secretRoomRepo.count({
        where: { status: 'active', isActive: true }
      })
    ]);

    // Calculate average room lifespan (simplified)
    const recentRooms = await this.secretRoomRepo.find({
      where: { status: 'deleted' },
      select: ['createdAt', 'archivedAt'],
      take: 100,
      order: { archivedAt: 'DESC' }
    });

    let averageLifespan = 0;
    if (recentRooms.length > 0) {
      const totalLifespan = recentRooms.reduce((sum, room) => {
        if (room.archivedAt) {
          return sum + (room.archivedAt.getTime() - room.createdAt.getTime());
        }
        return sum;
      }, 0);
      
      averageLifespan = totalLifespan / recentRooms.length / (1000 * 60 * 60); // Convert to hours
    }

    return {
      expiredRoomsCount: expiredCount,
      scheduledForDeletion: scheduledCount,
      averageRoomLifespan: Math.round(averageLifespan * 100) / 100
    };
  }
}