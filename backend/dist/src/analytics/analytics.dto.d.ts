import { MetricType } from './analytics.entity';
export declare class AnalyticsQueryDto {
    metricType?: MetricType;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
    groupBy?: 'day' | 'week' | 'month';
}
export declare class CreateAnalyticDto {
    metricType: MetricType;
    userId: string;
    roomId?: string;
    value?: number;
    metadata?: Record<string, any>;
}
export declare class AnalyticsResponseDto {
    totalMetrics: number;
    data: any[];
    aggregations: {
        totalVisits: number;
        totalTips: number;
        totalReactions: number;
        totalValue: number;
    };
    timeRange: {
        startDate: string;
        endDate: string;
    };
}
