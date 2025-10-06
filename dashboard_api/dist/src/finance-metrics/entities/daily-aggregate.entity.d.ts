export declare class DailyAggregate {
    id: string;
    date: Date;
    dailyVolume: number;
    cumulativeVolume: number;
    topUsers: {
        userId: string;
        volume: number;
        transactionCount: number;
    }[];
    trends: {
        volumeGrowth: number;
        userGrowth: number;
        predictedVolume: number;
    };
    hasSpike: boolean;
    spikeData: {
        magnitude: number;
        reason: string;
    };
    transactionCount: number;
    uniqueUsers: number;
    blockNumber: number;
    createdAt: Date;
    updatedAt: Date;
}
