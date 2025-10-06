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
var StellarVotingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarVotingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let StellarVotingService = StellarVotingService_1 = class StellarVotingService {
    configService;
    logger = new common_1.Logger(StellarVotingService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async getAccountBalance(accountId) {
        try {
            this.logger.log(`Fetching balance for account: ${accountId}`);
            const mockBalances = {
                'GCKFBEIYTKP6RCZNVXPBKAC': 1000.5,
                'GDQR7JZOJ3R4QU4P7XABT': 500.25,
                'GAFWXHKMKX7GVJR8VGFMC': 2500.75,
            };
            const balance = mockBalances[accountId.substring(0, 17)] || 100.0;
            this.logger.log(`Account ${accountId} balance: ${balance}`);
            return balance;
        }
        catch (error) {
            this.logger.error(`Failed to fetch account balance: ${error.message}`);
            throw new common_1.BadRequestException('Failed to fetch Stellar account balance');
        }
    }
    async recordVoteOnStellar(accountId, proposalId, choice, weight) {
        try {
            this.logger.log(`Recording vote on Stellar for account: ${accountId}`);
            this.logger.log(`Proposal: ${proposalId}, Choice: ${choice}, Weight: ${weight}`);
            const mockHash = `stellar_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            await new Promise(resolve => setTimeout(resolve, 500));
            this.logger.log(`Vote recorded on Stellar with transaction hash: ${mockHash}`);
            return mockHash;
        }
        catch (error) {
            this.logger.error(`Failed to record vote on Stellar: ${error.message}`);
            throw new common_1.BadRequestException('Failed to record vote on Stellar blockchain');
        }
    }
    async validateStellarTransaction(transactionHash) {
        try {
            this.logger.log(`Validating Stellar transaction: ${transactionHash}`);
            const isValid = transactionHash.startsWith('stellar_tx_');
            this.logger.log(`Transaction validation result: ${isValid}`);
            return isValid;
        }
        catch (error) {
            this.logger.error(`Failed to validate Stellar transaction: ${error.message}`);
            return false;
        }
    }
};
exports.StellarVotingService = StellarVotingService;
exports.StellarVotingService = StellarVotingService = StellarVotingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StellarVotingService);
//# sourceMappingURL=stellar-voting.service.js.map