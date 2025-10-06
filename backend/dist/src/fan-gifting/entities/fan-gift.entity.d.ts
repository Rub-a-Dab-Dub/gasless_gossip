export declare class FanGift {
    id: string;
    giftId: string;
    fanId: string;
    creatorId: string;
    txId: string;
    giftType: string;
    amount: string;
    stellarAsset: string;
    message: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}
