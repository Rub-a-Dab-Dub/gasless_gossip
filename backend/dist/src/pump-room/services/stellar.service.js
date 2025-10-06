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
var StellarService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let StellarService = StellarService_1 = class StellarService {
    configService;
    logger = new common_1.Logger(StellarService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async executeRewardContract(userAddress, rewardAmount, roomId, predictionId) {
        try {
            this.logger.log(`Executing reward contract for user: ${userAddress}, amount: ${rewardAmount}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const transactionHash = `stellar_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const reward = {
                transactionHash,
                amount: rewardAmount,
                recipientAddress: userAddress
            };
            this.logger.log(`Stellar reward executed: ${JSON.stringify(reward)}`);
            return reward;
        }
        catch (error) {
            this.logger.error(`Failed to execute Stellar reward: ${error.message}`);
            throw error;
        }
    }
    calculateRewardAmount(confidence, totalVotes) {
        const baseReward = 10;
        const confidenceMultiplier = confidence / 100;
        const earlyBirdBonus = Math.max(1, 50 - totalVotes) / 50;
        return Math.floor(baseReward * confidenceMultiplier * (1 + earlyBirdBonus));
    }
};
exports.StellarService = StellarService;
exports.StellarService = StellarService = StellarService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StellarService);
//# sourceMappingURL=stellar.service.js.map