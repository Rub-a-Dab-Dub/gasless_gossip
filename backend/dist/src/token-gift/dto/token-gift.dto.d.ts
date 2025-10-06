export declare class CreateTokenGiftDto {
    recipientId: string;
    tokenAddress: string;
    tokenSymbol: string;
    amount: string;
    network: 'stellar' | 'base' | 'ethereum';
    message?: string;
    metadata?: Record<string, any>;
}
export declare class TokenGiftDto {
    id: string;
    senderId: string;
    recipientId: string;
    tokenAddress: string;
    tokenSymbol: string;
    amount: string;
    network: string;
    status: string;
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
export declare class TokenGiftTransactionDto {
    id: string;
    giftId: string;
    network: string;
    txHash: string;
    status: string;
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
export declare class TokenGiftResponseDto {
    gift: TokenGiftDto;
    transactions: TokenGiftTransactionDto[];
    estimatedGas?: {
        stellar: string;
        base: string;
        total: string;
    };
    paymasterStatus?: {
        available: boolean;
        sponsored: boolean;
        maxGas: string;
    };
}
export declare class GasEstimateDto {
    network: string;
    gasUsed: string;
    gasPrice: string;
    totalCost: string;
    sponsored: boolean;
    paymasterCoverage?: string;
}
export declare class PaymasterStatusDto {
    available: boolean;
    sponsored: boolean;
    maxGas: string;
    remainingBalance: string;
    network: string;
}
