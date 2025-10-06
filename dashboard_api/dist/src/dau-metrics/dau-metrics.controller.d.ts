import type { DauMetricsService } from "./dau-metrics.service";
import type { CreateDauMetricDto } from "./dto/create-dau-metric.dto";
import type { UpdateDauMetricDto } from "./dto/update-dau-metric.dto";
import type { QueryDauMetricsDto } from "./dto/query-dau-metrics.dto";
import type { TrackFeatureUsageDto } from "./dto/track-feature-usage.dto";
export declare class DauMetricsController {
    private readonly dauMetricsService;
    constructor(dauMetricsService: DauMetricsService);
    computeDau(createDto: CreateDauMetricDto): Promise<import("./entities/dau-metric.entity").DauMetric>;
    computeDauBulk(createDtos: CreateDauMetricDto[]): Promise<import("./entities/dau-metric.entity").DauMetric[]>;
    computeDauFromUsage(date: string, timezone?: string): Promise<import("./entities/dau-metric.entity").DauMetric[]>;
    trackFeatureUsage(trackDto: TrackFeatureUsageDto): Promise<import("./entities/feature-usage.entity").FeatureUsage>;
    getDauBreakdown(query: QueryDauMetricsDto): Promise<import("./dto/dau-response.dto").DauBreakdownDto[]>;
    getMetrics(query: QueryDauMetricsDto): Promise<{
        data: import("./entities/dau-metric.entity").DauMetric[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateMetric(id: string, updateDto: UpdateDauMetricDto): Promise<import("./entities/dau-metric.entity").DauMetric>;
    getHistoricalTrends(startDate: string, endDate: string, timezone?: string): Promise<import("./dto/dau-response.dto").HistoricalTrendDto[]>;
    getFeatureDrilldown(startDate: string, endDate: string, timezone?: string): Promise<import("./dto/dau-response.dto").FeatureDrilldownDto[]>;
    getAlerts(isResolved?: boolean): Promise<import("./dto/dau-response.dto").AlertDropDto[]>;
    deleteAlert(id: string): Promise<void>;
    resolveAlert(id: string): Promise<import("./entities/dau-alert.entity").DauAlert>;
    getChartData(startDate: string, endDate: string, timezone?: string): Promise<{
        dauBreakdown: {
            type: string;
            data: import("./dto/dau-response.dto").DauBreakdownDto[];
            xAxis: string;
            yAxis: string;
            groupBy: string;
            title: string;
        };
        historicalTrends: {
            type: string;
            data: import("./dto/dau-response.dto").HistoricalTrendDto[];
            xAxis: string;
            yAxis: string;
            title: string;
        };
        featureDrilldown: {
            type: string;
            data: import("./dto/dau-response.dto").FeatureDrilldownDto[];
            valueField: string;
            labelField: string;
            title: string;
        };
    }>;
}
