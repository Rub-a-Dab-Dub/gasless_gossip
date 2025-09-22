export class GiftAnalyticsEvent {
  constructor(
    public readonly userId: string,
    public readonly action: 'gift_sent' | 'gift_received',
    public readonly metadata: {
      giftId: string;
      giftType?: string;
      giftValue?: number;
      recipientId?: string;
    },
    public readonly timestamp: Date = new Date()
  ) {}
}