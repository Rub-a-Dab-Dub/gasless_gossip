export declare class GiftAnalyticsEvent {
    readonly userId: string;
    readonly action: 'gift_sent' | 'gift_received';
    readonly metadata: {
        giftId: string;
        giftType?: string;
        giftValue?: number;
        recipientId?: string;
    };
    readonly timestamp: Date;
    constructor(userId: string, action: 'gift_sent' | 'gift_received', metadata: {
        giftId: string;
        giftType?: string;
        giftValue?: number;
        recipientId?: string;
    }, timestamp?: Date);
}
