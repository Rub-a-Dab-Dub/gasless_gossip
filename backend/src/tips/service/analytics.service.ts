import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface TipAnalyticsEvent {
  eventType: 'tip_sent' | 'tip_received';
  userId: string;
  amount: number;
  txId: string;
  timestamp: Date;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private eventEmitter: EventEmitter2) {}

  emitTipEvent(event: TipAnalyticsEvent): void {
    this.logger.log(`Emitting analytics event: ${event.eventType} for user ${event.userId}`);
    
    // Emit specific events for different listeners
    this.eventEmitter.emit(`tip.${event.eventType}`, event);
    this.eventEmitter.emit('tip.activity', event);
    
    // You can also emit to external analytics services here
    // Example: Google Analytics, Mixpanel, etc.
  }

  async trackUserEngagement(userId: string, action: string, metadata?: any): Promise<void> {
    const event = {
      userId,
      action,
      metadata,
      timestamp: new Date()
    };

    this.logger.log(`Tracking user engagement: ${JSON.stringify(event)}`);
    this.eventEmitter.emit('user.engagement', event);
  }
}