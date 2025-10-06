export declare class TokenGiftTransaction {
    id: string;
    giftId: string;
    network: string;
    txHash: string;
    status: 'pending' | 'confirmed' | 'failed';
    blockNumber?: string;
    confirmations?: number;
    gasUsed?: string;
    gasPrice?: string;
    effectiveGasPrice?: string;
    transactionFee?: string;
    sponsored: boolean;
    paymasterAddress?: string;
    transactionData?: Record<string, any>;
    receipt?: Record<string, any>;
    errorMessage?: string;
    createdAt: Date;
}
