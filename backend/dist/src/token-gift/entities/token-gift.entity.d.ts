export declare class TokenGift {
    id: string;
    senderId: string;
    recipientId: string;
    tokenAddress: string;
    tokenSymbol: string;
    amount: string;
    network: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    stellarTxHash?: string;
    baseTxHash?: string;
    paymasterTxHash?: string;
    gasUsed?: string;
    gasPrice?: string;
    totalCost?: string;
    message?: string;
    metadata?: Record<string, any>;
    sorobanData?: Record<string, any>;
    paymasterData?: Record<string, any>;
    processedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
