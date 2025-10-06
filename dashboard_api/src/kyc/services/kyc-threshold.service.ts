import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VerificationLevel } from '../entities/kyc.entity';

export interface ThresholdConfig {
  level: VerificationLevel;
  maxTransactionAmount: number;
  maxDailyVolume: number;
  requiresOnChainVerification: boolean;
  description: string;
}

@Injectable()
export class KycThresholdService {
  private thresholds: ThresholdConfig[];

  constructor(private configService: ConfigService) {
    this.thresholds = this.loadThresholds();
  }

  getRequiredLevel(transactionAmount: number, dailyVolume: number): VerificationLevel {
    for (const threshold of this.thresholds.reverse()) {
      if (
        transactionAmount <= threshold.maxTransactionAmount &&
        dailyVolume <= threshold.maxDailyVolume
      ) {
        return threshold.level;
      }
    }

    return VerificationLevel.PREMIUM;
  }

  requiresKyc(transactionAmount: number): boolean {
    const basicThreshold = this.thresholds.find(
      t => t.level === VerificationLevel.BASIC,
    );
    return transactionAmount > (basicThreshold?.maxTransactionAmount || 0);
  }

  requiresOnChainVerification(level: VerificationLevel): boolean {
    const config = this.thresholds.find(t => t.level === level);
    return config?.requiresOnChainVerification || false;
  }

  getThresholdConfig(level: VerificationLevel): ThresholdConfig | undefined {
    return this.thresholds.find(t => t.level === level);
  }

  getAllThresholds(): ThresholdConfig[] {
    return this.thresholds;
  }

  private loadThresholds(): ThresholdConfig[] {
    // Load from config or database
    // In production, this could be stored in a database and updated dynamically
    return [
      {
        level: VerificationLevel.NONE,
        maxTransactionAmount: 100,
        maxDailyVolume: 500,
        requiresOnChainVerification: false,
        description: 'No KYC required for small transactions',
      },
      {
        level: VerificationLevel.BASIC,
        maxTransactionAmount: 1000,
        maxDailyVolume: 5000,
        requiresOnChainVerification: false,
        description: 'Basic verification for moderate transactions',
      },
      {
        level: VerificationLevel.ADVANCED,
        maxTransactionAmount: 10000,
        maxDailyVolume: 50000,
        requiresOnChainVerification: true,
        description: 'Advanced verification with on-chain proof',
      },
      {
        level: VerificationLevel.PREMIUM,
        maxTransactionAmount: Infinity,
        maxDailyVolume: Infinity,
        requiresOnChainVerification: true,
        description: 'Premium verification for high-value users',
      },
    ];
  }

  updateThreshold(level: VerificationLevel, config: Partial<ThresholdConfig>): void {
    const index = this.thresholds.findIndex(t => t.level === level);
    if (index !== -1) {
      this.thresholds[index] = { ...this.thresholds[index], ...config };
    }
  }
}