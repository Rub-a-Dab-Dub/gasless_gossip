export declare class DegenRoiEntity {
    id: string;
    roomCategory: string;
    winRate: number;
    totalWagered: number;
    totalReturned: number;
    roiPercentage: number;
    totalBets: number;
    winningBets: number;
    losingBets: number;
    isAnomaly: boolean;
    avgBetSize: number;
    outcomeDistribution: Record<string, any>;
    timestamp: Date;
    updatedAt: Date;
}
