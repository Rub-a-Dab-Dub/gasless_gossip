export declare class DegenScore {
    id: string;
    userId: string;
    username: string;
    category: string;
    score: number;
    totalBets: number;
    totalWagered: number;
    totalWon: number;
    totalLost: number;
    winRate: number;
    avgBetSize: number;
    riskScore: number;
    cycleId: string;
    cycleStartDate: Date;
    cycleEndDate: Date;
    rank: number;
    badge: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
