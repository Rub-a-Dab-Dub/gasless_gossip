export declare class GiftGivenEvent {
    readonly giftId: string;
    readonly userId: string;
    readonly recipientId?: string | undefined;
    readonly giftType?: string | undefined;
    readonly giftValue?: number | undefined;
    readonly timestamp: Date;
    constructor(giftId: string, userId: string, recipientId?: string | undefined, giftType?: string | undefined, giftValue?: number | undefined, timestamp?: Date);
}
