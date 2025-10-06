import { ConfigService } from '@nestjs/config';
import { VerificationLevel } from '../entities/kyc.entity';
export interface ThresholdConfig {
    level: VerificationLevel;
    maxTransactionAmount: number;
    maxDailyVolume: number;
    requiresOnChainVerification: boolean;
    description: string;
}
export declare class KycThresholdService {
    private configService;
    private thresholds;
    constructor(configService: ConfigService);
    getRequiredLevel(transactionAmount: number, dailyVolume: number): VerificationLevel;
    requiresKyc(transactionAmount: number): boolean;
    requiresOnChainVerification(level: VerificationLevel): boolean;
    getThresholdConfig(level: VerificationLevel): ThresholdConfig | undefined;
    getAllThresholds(): ThresholdConfig[];
    private loadThresholds;
    updateThreshold(level: VerificationLevel, config: Partial<ThresholdConfig>): void;
}
