import { FinanceMetricsService } from './finance-metrics.service';
import { TopUsersQuery, ComparePeriodsQuery } from './dto/query.dto';
import { ROIComparisonResponse, TopUserResponse, TrendForecastResponse } from './dto/response.dto';
import { DailyAggregate } from './entities/daily-aggregate.entity';
export declare class FinanceMetricsController {
    private readonly financeMetricsService;
    constructor(financeMetricsService: FinanceMetricsService);
    createDailyAggregate(date: string): Promise<DailyAggregate>;
    getTopUsers(query: TopUsersQuery): Promise<TopUserResponse[]>;
    updateTrendForecast(id: string): Promise<TrendForecastResponse>;
    deleteSpike(id: string): Promise<void>;
    compareROI(query: ComparePeriodsQuery): Promise<ROIComparisonResponse>;
}
