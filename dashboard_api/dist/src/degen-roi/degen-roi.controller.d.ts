import { DegenRoiService } from './degen-roi.service';
import { CreateWinRateDto } from './dto/create-win-rate.dto';
import { UpdateRoiCalcDto } from './dto/update-roi-calc.dto';
import { RiskMetricsQueryDto } from './dto/risk-metrics.dto';
export declare class DegenRoiController {
    private readonly roiService;
    constructor(roiService: DegenRoiService);
    createWinRate(dto: CreateWinRateDto): Promise<import("./entities/degen-roi.entity").DegenRoiEntity>;
    getRiskMetrics(query: RiskMetricsQueryDto): Promise<import("./interfaces/roi-metrics.interface").IRoiMetrics[]>;
    updateRoiCalc(id: string, dto: UpdateRoiCalcDto): Promise<import("./entities/degen-roi.entity").DegenRoiEntity>;
    deleteAnomalyReport(id: string): Promise<void>;
    getOutcomeQueries(roomCategory: string): Promise<any>;
    getHistoricalComparison(roomCategory: string): Promise<import("./interfaces/roi-metrics.interface").IHistoricalComparison>;
    getLossAlerts(roomCategory?: string): Promise<import("./interfaces/roi-metrics.interface").ILossAlert[]>;
}
