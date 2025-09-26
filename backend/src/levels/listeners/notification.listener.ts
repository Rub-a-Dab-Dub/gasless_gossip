import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { LevelUpEvent } from '../events/level-up.event';
import type { XpGainedEvent } from '../events/xp-gained.event';
import type { BadgeUnlockedEvent } from '../events/badge-unlocked.event';
import type { NotificationService } from '../services/notification.service';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent('level.up')
  async handleLevelUpEvent(event: LevelUpEvent) {
    this.logger.log(`Handling level up notification for user ${event.userId}`);
    await this.notificationService.sendLevelUpNotification(event);
  }

  @OnEvent('xp.gained')
  async handleXpGainedEvent(event: XpGainedEvent) {
    // Only send notification for significant XP gains to avoid spam
    if (event.xpAmount >= 10) {
      this.logger.log(
        `Handling XP gained notification for user ${event.userId}`,
      );
      await this.notificationService.sendXpGainedNotification(event);
    }
  }

  @OnEvent('badge.unlocked')
  async handleBadgeUnlockedEvent(event: BadgeUnlockedEvent) {
    this.logger.log(
      `Handling badge unlocked notification for user ${event.userId}`,
    );
    await this.notificationService.sendBadgeUnlockedNotification(event);
  }
}
