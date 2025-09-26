import { Injectable, Logger } from '@nestjs/common';
import type { LevelUpEvent } from '../events/level-up.event';
import type { XpGainedEvent } from '../events/xp-gained.event';
import type { BadgeUnlockedEvent } from '../events/badge-unlocked.event';

export interface NotificationPayload {
  userId: string;
  type: 'level_up' | 'xp_gained' | 'badge_unlocked';
  title: string;
  message: string;
  data?: Record<string, any>;
  timestamp: Date;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendLevelUpNotification(event: LevelUpEvent): Promise<void> {
    const notification: NotificationPayload = {
      userId: event.userId,
      type: 'level_up',
      title: 'Level Up!',
      message: `Congratulations! You've reached level ${event.newLevel}!`,
      data: {
        previousLevel: event.previousLevel,
        newLevel: event.newLevel,
        totalXp: event.totalXp,
        badgesUnlocked: event.badgesUnlocked,
      },
      timestamp: new Date(),
    };

    await this.sendNotification(notification);
  }

  async sendXpGainedNotification(event: XpGainedEvent): Promise<void> {
    const notification: NotificationPayload = {
      userId: event.userId,
      type: 'xp_gained',
      title: 'XP Gained!',
      message: `You earned ${event.xpAmount} XP from ${event.source}!`,
      data: {
        xpAmount: event.xpAmount,
        source: event.source,
        metadata: event.metadata,
      },
      timestamp: new Date(),
    };

    await this.sendNotification(notification);
  }

  async sendBadgeUnlockedNotification(
    event: BadgeUnlockedEvent,
  ): Promise<void> {
    const notification: NotificationPayload = {
      userId: event.userId,
      type: 'badge_unlocked',
      title: 'Badge Unlocked!',
      message: `You've unlocked the ${event.badgeId} badge!`,
      data: {
        badgeId: event.badgeId,
        level: event.level,
        stellarTransactionId: event.stellarTransactionId,
      },
      timestamp: new Date(),
    };

    await this.sendNotification(notification);
  }

  private async sendNotification(
    notification: NotificationPayload,
  ): Promise<void> {
    // Here you would implement the actual notification sending logic:
    // - WebSocket for real-time notifications
    // - Push notifications
    // - Email notifications
    // - In-app notification storage

    this.logger.log(
      `Sending ${notification.type} notification to user ${notification.userId}: ${notification.message}`,
    );

    // Example: Store notification in database for in-app display
    // await this.notificationRepository.save(notification);

    // Example: Send real-time notification via WebSocket
    // this.websocketGateway.sendToUser(notification.userId, notification);

    // Example: Send push notification
    // await this.pushNotificationService.send(notification.userId, notification);
  }
}
