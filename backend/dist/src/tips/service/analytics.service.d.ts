import { EventEmitter2 } from '@nestjs/event-emitter';
export interface TipAnalyticsEvent {
    eventType: 'tip_sent' | 'tip_received';
    userId: string;
    amount: number;
    txId: string;
    timestamp: Date;
}
export declare class AnalyticsService {
    private eventEmitter;
    private readonly logger;
    constructor(eventEmitter: EventEmitter2);
    emitTipEvent(event: TipAnalyticsEvent): void;
    trackUserEngagement(userId: string, action: string, metadata?: any): Promise<void>;
}
