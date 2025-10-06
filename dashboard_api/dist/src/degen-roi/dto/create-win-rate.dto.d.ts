export declare class CreateWinRateDto {
    roomCategory: string;
    totalWagered: number;
    totalReturned: number;
    totalBets: number;
    winningBets: number;
    losingBets: number;
    outcomeDistribution?: Record<string, any>;
}
