import type { GrowthAnalyticsService } from "./growth-analytics.service";
import type { CreateGrowthMetricDto } from "./dto/create-growth-metric.dto";
import type { UpdateGrowthMetricDto } from "./dto/update-growth-metric.dto";
import type { QueryGrowthMetricsDto } from "./dto/query-growth-metrics.dto";
import type { CreateCohortDto } from "./dto/create-cohort.dto";
export declare class GrowthAnalyticsController {
    private readonly growthAnalyticsService;
    constructor(growthAnalyticsService: GrowthAnalyticsService);
    createMetric(createDto: CreateGrowthMetricDto): Promise<import("./entities/growth-metric.entity").GrowthMetric>;
    createMetricsBulk(createDtos: CreateGrowthMetricDto[]): Promise<import("./entities/growth-metric.entity").GrowthMetric[]>;
    getMetrics(query: QueryGrowthMetricsDto): Promise<{
        data: import("./entities/growth-metric.entity").GrowthMetric[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAverageLevels(startDate: string, endDate: string, cohortId?: string): Promise<import("./dto/analytics-response.dto").AverageLevelsDto[]>;
    getUnlockRates(startDate: string, endDate: string, cohortId?: string): Promise<import("./dto/analytics-response.dto").UnlockRatesDto[]>;
    updateMetric(id: string, updateDto: UpdateGrowthMetricDto): Promise<import("./entities/growth-metric.entity").GrowthMetric>;
    getDropOffAnalysis(startDate: string, endDate: string, cohortId?: string): Promise<import("./dto/analytics-response.dto").DropOffAnalysisDto[]>;
    createCohort(createDto: CreateCohortDto): Promise<import("./entities/cohort.entity").Cohort>;
    getCohorts(): Promise<import("./entities/cohort.entity").Cohort[]>;
    getCohort(id: string): Promise<import("./entities/cohort.entity").Cohort>;
    deleteCohort(id: string): Promise<void>;
    getCohortAnalysis(id: string): Promise<import("./dto/analytics-response.dto").CohortAnalysisDto>;
    getChartData(startDate: string, endDate: string, cohortId?: string): Promise<{
        averageLevels: {
            type: string;
            data: import("./dto/analytics-response.dto").AverageLevelsDto[];
            xAxis: string;
            yAxis: string;
            title: string;
        };
        unlockRates: {
            type: string;
            data: import("./dto/analytics-response.dto").UnlockRatesDto[];
            xAxis: string;
            yAxis: string;
            title: string;
        };
        dropOffAnalysis: {
            type: string;
            data: import("./dto/analytics-response.dto").DropOffAnalysisDto[];
            xAxis: string;
            yAxis: string;
            title: string;
        };
    }>;
    predictPlateaus(cohortId?: string): Promise<import("./dto/analytics-response.dto").PlateauPredictionDto>;
    getSegmentedLevels(startDate: string, endDate: string): Promise<{
        range: string;
        userCount: number;
    }[]>;
}
