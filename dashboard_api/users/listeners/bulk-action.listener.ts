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