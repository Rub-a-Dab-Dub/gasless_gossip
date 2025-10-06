import { Repository } from 'typeorm';
import { DegenRoiEntity } from './entities/degen-roi.entity';
import { CreateWinRateDto } from './dto/create-win-rate.dto';
import { UpdateRoiCalcDto } from './dto/update-roi-calc.dto';
import { RiskMetricsQueryDto } from './dto/risk-metrics.dto';
import { IRoiMetrics, IHistoricalComparison, ILossAlert } from './interfaces/roi-metrics.interface';
export declare class DegenRoiService {
    private roiRepo;
    private readonly LOSS_THRESHOLD;
    private readonly ANOMALY_THRESHOLD;
    constructor(roiRepo: Repository<DegenRoiEntity>);
    createWinRate(dto: CreateWinRateDto): Promise<DegenRoiEntity>;
    getRiskMetrics(query: RiskMetricsQueryDto): Promise<IRoiMetrics[]>;
    updateRoiCalc(id: string, dto: UpdateRoiCalcDto): Promise<DegenRoiEntity>;
    deleteAnomalyReport(id: string): Promise<void>;
    getOutcomeQueries(roomCategory: string): Promise<any>;
    getHistoricalComparison(roomCategory: string): Promise<IHistoricalComparison>;
    getLossAlerts(roomCategory?: string): Promise<ILossAlert[]>;
    private detectAnomaly;
    private checkLossAlert;
    private calculateSeverity;
    private aggregateOutcomes;
    private getAggregatedMetrics;
}
