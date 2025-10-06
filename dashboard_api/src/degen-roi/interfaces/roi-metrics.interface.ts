export interface IRoiMetrics {
  winRate: number;
  roiPercentage: number;
  totalBets: number;
  profitLoss: number;
  avgBetSize: number;
  roomCategory: string;
}

export interface IHistoricalComparison {
  current: IRoiMetrics;
  previous: IRoiMetrics;
  percentageChange: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface ILossAlert {
  roomCategory: string;
  lossAmount: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}