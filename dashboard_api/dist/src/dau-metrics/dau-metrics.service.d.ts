import type { Repository } from "typeorm";
import type { DauMetric } from "./entities/dau-metric.entity";
import type { DauAlert } from "./entities/dau-alert.entity";
import type { FeatureUsage } from "./entities/feature-usage.entity";
import type { CreateDauMetricDto } from "./dto/create-dau-metric.dto";
import type { UpdateDauMetricDto } from "./dto/update-dau-metric.dto";
import type { QueryDauMetricsDto } from "./dto/query-dau-metrics.dto";
import type { TrackFeatureUsageDto } from "./dto/track-feature-usage.dto";
import type { DauBreakdownDto, HistoricalTrendDto, FeatureDrilldownDto, AlertDropDto } from "./dto/dau-response.dto";
export declare class DauMetricsService {
    private dauMetricRepository;
    private dauAlertRepository;
    private featureUsageRepository;
    constructor(dauMetricRepository: Repository<DauMetric>, dauAlertRepository: Repository<DauAlert>, featureUsageRepository: Repository<FeatureUsage>);
    computeDau(createDto: CreateDauMetricDto): Promise<DauMetric>;
    computeDauBulk(createDtos: CreateDauMetricDto[]): Promise<DauMetric[]>;
    trackFeatureUsage(trackDto: TrackFeatureUsageDto): Promise<FeatureUsage>;
    getDauBreakdown(query: QueryDauMetricsDto): Promise<DauBreakdownDto[]>;
    getMetrics(query: QueryDauMetricsDto): Promise<{
        data: DauMetric[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateMetric(id: string, updateDto: UpdateDauMetricDto): Promise<DauMetric>;
    getHistoricalTrends(startDate: string, endDate: string, timezone?: string): Promise<HistoricalTrendDto[]>;
    getFeatureDrilldown(startDate: string, endDate: string, timezone?: string): Promise<FeatureDrilldownDto[]>;
    deleteAlert(id: string): Promise<void>;
    getAlerts(isResolved?: boolean): Promise<AlertDropDto[]>;
    resolveAlert(id: string): Promise<DauAlert>;
    private checkForAlerts;
    getChartData(startDate: string, endDate: string, timezone?: string): Promise<{
        dauBreakdown: {
            type: string;
            data: DauBreakdownDto[];
            xAxis: string;
            yAxis: string;
            groupBy: string;
            title: string;
        };
        historicalTrends: {
            type: string;
            data: HistoricalTrendDto[];
            xAxis: string;
            yAxis: string;
            title: string;
        };
        featureDrilldown: {
            type: string;
            data: FeatureDrilldownDto[];
            valueField: string;
            labelField: string;
            title: string;
        };
    }>;
    private getDateInTimezone;
    computeDauFromUsage(date: string, timezone?: string): Promise<DauMetric[]>;
}
