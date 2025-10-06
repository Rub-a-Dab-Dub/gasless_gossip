import type { Repository } from "typeorm";
import type { GrowthMetric } from "./entities/growth-metric.entity";
import type { Cohort } from "./entities/cohort.entity";
import type { CreateGrowthMetricDto } from "./dto/create-growth-metric.dto";
import type { UpdateGrowthMetricDto } from "./dto/update-growth-metric.dto";
import type { QueryGrowthMetricsDto } from "./dto/query-growth-metrics.dto";
import type { CreateCohortDto } from "./dto/create-cohort.dto";
import type { AverageLevelsDto, UnlockRatesDto, DropOffAnalysisDto, CohortAnalysisDto, PlateauPredictionDto } from "./dto/analytics-response.dto";
export declare class GrowthAnalyticsService {
    private growthMetricRepository;
    private cohortRepository;
    constructor(growthMetricRepository: Repository<GrowthMetric>, cohortRepository: Repository<Cohort>);
    createMetric(createDto: CreateGrowthMetricDto): Promise<GrowthMetric>;
    createMetricsBulk(createDtos: CreateGrowthMetricDto[]): Promise<GrowthMetric[]>;
    getMetrics(query: QueryGrowthMetricsDto): Promise<{
        data: GrowthMetric[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateMetric(id: string, updateDto: UpdateGrowthMetricDto): Promise<GrowthMetric>;
    getAverageLevels(startDate: string, endDate: string, cohortId?: string): Promise<AverageLevelsDto[]>;
    getUnlockRates(startDate: string, endDate: string, cohortId?: string): Promise<UnlockRatesDto[]>;
    getDropOffAnalysis(startDate: string, endDate: string, cohortId?: string): Promise<DropOffAnalysisDto[]>;
    predictPlateaus(cohortId?: string): Promise<PlateauPredictionDto>;
    getSegmentedLevels(startDate: string, endDate: string): Promise<{
        range: string;
        userCount: number;
    }[]>;
    createCohort(createDto: CreateCohortDto): Promise<Cohort>;
    getCohorts(): Promise<Cohort[]>;
    getCohort(id: string): Promise<Cohort>;
    deleteCohort(id: string): Promise<void>;
    getCohortAnalysis(cohortId: string): Promise<CohortAnalysisDto>;
    getChartData(startDate: string, endDate: string, cohortId?: string): Promise<{
        averageLevels: {
            type: string;
            data: AverageLevelsDto[];
            xAxis: string;
            yAxis: string;
            title: string;
        };
        unlockRates: {
            type: string;
            data: UnlockRatesDto[];
            xAxis: string;
            yAxis: string;
            title: string;
        };
        dropOffAnalysis: {
            type: string;
            data: DropOffAnalysisDto[];
            xAxis: string;
            yAxis: string;
            title: string;
        };
    }>;
}
