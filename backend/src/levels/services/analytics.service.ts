import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { LevelUpEvent } from '../events/level-up.event';
import type { XpGainedEvent } from '../events/xp-gained.event';

export interface AnalyticsEvent {
  userId: string;
  eventType: string;
  properties: Record<string, any>;
  timestamp: Date;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  @OnEvent('level.up')
  async trackLevelUp(event: LevelUpEvent) {
    const analyticsEvent: AnalyticsEvent = {
      userId: event.userId,
      eventType: 'level_up',
      properties: {
        previous_level: event.previousLevel,
        new_level: event.newLevel,
        total_xp: event.totalXp,
        badges_unlocked: event.badgesUnlocked,
        level_difference: event.newLevel - event.previousLevel,
      },
      timestamp: new Date(),
    };

    await this.trackEvent(analyticsEvent);
  }

  @OnEvent('xp.gained')
  async trackXpGained(event: XpGainedEvent) {
    const analyticsEvent: AnalyticsEvent = {
      userId: event.userId,
      eventType: 'xp_gained',
      properties: {
        xp_amount: event.xpAmount,
        source: event.source,
        metadata: event.metadata,
      },
      timestamp: new Date(),
    };

    await this.trackEvent(analyticsEvent);
  }

  private async trackEvent(event: AnalyticsEvent): Promise<void> {
    this.logger.log(
      `Tracking analytics event: ${event.eventType} for user ${event.userId}`,
    );

    // Here you would send the event to your analytics service:
    // - Google Analytics
    // - Mixpanel
    // - Amplitude
    // - Custom analytics database

    // Example implementations:
    // await this.mixpanelService.track(event.userId, event.eventType, event.properties);
    // await this.googleAnalytics.event(event.eventType, event.properties);
    // await this.analyticsRepository.save(event);
  }
}
