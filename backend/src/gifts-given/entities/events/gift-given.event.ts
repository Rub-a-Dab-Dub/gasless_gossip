export class GiftGivenEvent {
  constructor(
    public readonly giftId: string,
    public readonly userId: string,
    public readonly recipientId?: string,
    public readonly giftType?: string,
    public readonly giftValue?: number,
    public readonly timestamp: Date = new Date()
  ) {}
}