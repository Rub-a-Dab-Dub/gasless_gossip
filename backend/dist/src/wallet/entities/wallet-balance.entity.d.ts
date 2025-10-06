export declare class WalletBalance {
    id: string;
    userId: string;
    network: string;
    asset: string;
    contractAddress?: string;
    balance: string;
    formattedBalance: string;
    symbol?: string;
    decimals?: number;
    assetType?: string;
    walletAddress?: string;
    usdValue?: string;
    priceUsd?: string;
    priceSource?: string;
    isStaking: boolean;
    stakingRewards?: string;
    metadata?: {
        lastUpdated?: string;
        blockNumber?: string;
        transactionHash?: string;
        gasUsed?: string;
        gasPrice?: string;
        networkFee?: string;
        confirmationCount?: number;
        isTestnet?: boolean;
        explorerUrl?: string;
    };
    tokenInfo?: {
        name?: string;
        symbol?: string;
        decimals?: number;
        totalSupply?: string;
        contractAddress?: string;
        logoUrl?: string;
        website?: string;
        description?: string;
    };
    lastFetchedAt?: Date;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
