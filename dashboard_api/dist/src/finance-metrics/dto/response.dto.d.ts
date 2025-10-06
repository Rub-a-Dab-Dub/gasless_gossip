export declare class ROIComparisonResponse {
    period1ROI: number;
    period2ROI: number;
    difference: number;
    percentageChange: number;
}
export declare class TopUserResponse {
    userId: string;
    totalVolume: number;
    transactionCount: number;
    lastActive: Date;
}
export declare class TrendForecastResponse {
    predictedVolume: number;
    confidence: number;
    growthRate: number;
}
