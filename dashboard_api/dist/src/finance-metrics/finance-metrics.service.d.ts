import { Repository } from 'typeorm';
import { DailyAggregate } from './entities/daily-aggregate.entity';
import { ROIComparisonResponse, TopUserResponse, TrendForecastResponse } from './dto/response.dto';
import { ConfigService } from '@nestjs/config';
export declare class FinanceMetricsService {
    private readonly dailyAggregateRepo;
    private configService;
    private provider;
    constructor(dailyAggregateRepo: Repository<DailyAggregate>, configService: ConfigService);
    createDailyAggregate(date: Date): Promise<DailyAggregate>;
    getTopUsers(startDate: Date, endDate: Date, limit?: number): Promise<TopUserResponse[]>;
    updateTrendForecast(id: string): Promise<TrendForecastResponse>;
    deleteSpikeAlert(id: string): Promise<void>;
    compareROI(period1Start: Date, period1End: Date, period2Start: Date, period2End: Date): Promise<ROIComparisonResponse>;
    private getBlockNumberForDate;
    private getTransactions;
    private processTransactions;
    private parseTransferLog;
    private updateUserVolume;
    private calculateROI;
    private calculateTrend;
}
