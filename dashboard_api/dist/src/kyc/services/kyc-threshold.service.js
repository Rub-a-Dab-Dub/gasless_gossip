"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycThresholdService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const kyc_entity_1 = require("../entities/kyc.entity");
let KycThresholdService = class KycThresholdService {
    configService;
    thresholds;
    constructor(configService) {
        this.configService = configService;
        this.thresholds = this.loadThresholds();
    }
    getRequiredLevel(transactionAmount, dailyVolume) {
        for (const threshold of this.thresholds.reverse()) {
            if (transactionAmount <= threshold.maxTransactionAmount &&
                dailyVolume <= threshold.maxDailyVolume) {
                return threshold.level;
            }
        }
        return kyc_entity_1.VerificationLevel.PREMIUM;
    }
    requiresKyc(transactionAmount) {
        const basicThreshold = this.thresholds.find(t => t.level === kyc_entity_1.VerificationLevel.BASIC);
        return transactionAmount > (basicThreshold?.maxTransactionAmount || 0);
    }
    requiresOnChainVerification(level) {
        const config = this.thresholds.find(t => t.level === level);
        return config?.requiresOnChainVerification || false;
    }
    getThresholdConfig(level) {
        return this.thresholds.find(t => t.level === level);
    }
    getAllThresholds() {
        return this.thresholds;
    }
    loadThresholds() {
        return [
            {
                level: kyc_entity_1.VerificationLevel.NONE,
                maxTransactionAmount: 100,
                maxDailyVolume: 500,
                requiresOnChainVerification: false,
                description: 'No KYC required for small transactions',
            },
            {
                level: kyc_entity_1.VerificationLevel.BASIC,
                maxTransactionAmount: 1000,
                maxDailyVolume: 5000,
                requiresOnChainVerification: false,
                description: 'Basic verification for moderate transactions',
            },
            {
                level: kyc_entity_1.VerificationLevel.ADVANCED,
                maxTransactionAmount: 10000,
                maxDailyVolume: 50000,
                requiresOnChainVerification: true,
                description: 'Advanced verification with on-chain proof',
            },
            {
                level: kyc_entity_1.VerificationLevel.PREMIUM,
                maxTransactionAmount: Infinity,
                maxDailyVolume: Infinity,
                requiresOnChainVerification: true,
                description: 'Premium verification for high-value users',
            },
        ];
    }
    updateThreshold(level, config) {
        const index = this.thresholds.findIndex(t => t.level === level);
        if (index !== -1) {
            this.thresholds[index] = { ...this.thresholds[index], ...config };
        }
    }
};
exports.KycThresholdService = KycThresholdService;
exports.KycThresholdService = KycThresholdService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], KycThresholdService);
//# sourceMappingURL=kyc-threshold.service.js.map