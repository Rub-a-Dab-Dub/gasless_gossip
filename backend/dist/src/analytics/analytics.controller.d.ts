import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto, CreateAnalyticDto, AnalyticsResponseDto } from './analytics.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    createAnalytic(createAnalyticDto: CreateAnalyticDto): Promise<import("./analytics.entity").Analytic>;
    getUserAnalytics(userId: string, query: AnalyticsQueryDto): Promise<AnalyticsResponseDto>;
    getRoomAnalytics(roomId: string, query: AnalyticsQueryDto): Promise<AnalyticsResponseDto>;
    trackVisit(body: {
        userId: string;
        roomId?: string;
        metadata?: Record<string, any>;
    }): Promise<import("./analytics.entity").Analytic>;
    trackTip(body: {
        userId: string;
        amount: number;
        roomId?: string;
        metadata?: Record<string, any>;
    }): Promise<import("./analytics.entity").Analytic>;
    trackReaction(body: {
        userId: string;
        roomId?: string;
        reactionType?: string;
    }): Promise<import("./analytics.entity").Analytic>;
}
