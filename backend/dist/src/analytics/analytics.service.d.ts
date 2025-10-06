import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Analytic } from './analytics.entity';
import { AnalyticsQueryDto, CreateAnalyticDto, AnalyticsResponseDto } from './analytics.dto';
export declare class AnalyticsService {
    private readonly analyticRepository;
    private readonly eventEmitter;
    private readonly logger;
    constructor(analyticRepository: Repository<Analytic>, eventEmitter: EventEmitter2);
    createAnalytic(createAnalyticDto: CreateAnalyticDto): Promise<Analytic>;
    getUserAnalytics(userId: string, query: AnalyticsQueryDto): Promise<AnalyticsResponseDto>;
    getRoomAnalytics(roomId: string, query: AnalyticsQueryDto): Promise<AnalyticsResponseDto>;
    private createBaseQuery;
    private applyFilters;
    private getAggregations;
    private groupData;
    trackVisit(userId: string, roomId?: string, metadata?: Record<string, any>): Promise<Analytic>;
    trackTip(userId: string, amount: number, roomId?: string, metadata?: Record<string, any>): Promise<Analytic>;
    trackReaction(userId: string, roomId?: string, reactionType?: string): Promise<Analytic>;
}
