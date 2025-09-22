import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { LevelUpEvent } from '../events/level-up.event';

@Injectable()
export class LevelUpListener {
  private readonly logger = new Logger(LevelUpListener.name);

  @OnEvent('level.up')
  async handleLevelUpEvent(event: LevelUpEvent) {
    this.logger.log(
      `Level up event: User ${event.userId} reached level ${event.newLevel} (from ${event.previousLevel}) with ${event.totalXp} total XP`,
    );

    // Here you can add additional logic for level up events:
    // - Send notifications to the user
    // - Update UI animations
    // - Trigger badge unlocks via Stellar
    // - Log analytics events
    // - Send webhooks to external services

    if (event.badgesUnlocked.length > 0) {
      this.logger.log(
        `Badges unlocked for user ${event.userId}: ${event.badgesUnlocked.join(', ')}`,
      );

      // TODO: Integrate with Stellar contract to unlock badges
      // await this.stellarService.unlockBadges(event.userId, event.badgesUnlocked);
    }
  }
}
