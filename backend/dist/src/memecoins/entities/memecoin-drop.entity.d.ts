export declare class MemecoinDrop {
    id: string;
    recipients: string[];
    amount: number;
    txId: string;
    assetCode: string;
    assetIssuer: string;
    dropType: string;
    status: 'pending' | 'completed' | 'failed';
    failureReason: string;
    createdAt: Date;
    updatedAt: Date;
}
