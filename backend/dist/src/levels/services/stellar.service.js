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
const event_emitter_1 = require("@nestjs/event-emitter");
const badge_unlocked_event_1 = require("../events/badge-unlocked.event");
let StellarService = StellarService_1 = class StellarService {
    configService;
    eventEmitter;
    logger = new common_1.Logger(StellarService_1.name);
    contractConfig;
    constructor(configService, eventEmitter) {
        this.configService = configService;
        this.eventEmitter = eventEmitter;
        this.contractConfig = {
            contractAddress: this.configService.get('STELLAR_BADGE_CONTRACT_ADDRESS') || '',
            networkPassphrase: this.configService.get('STELLAR_NETWORK_PASSPHRASE') ||
                'Test SDF Network ; September 2015',
            sourceAccount: this.configService.get('STELLAR_SOURCE_ACCOUNT') || '',
        };
    }
    async handleLevelUpBadgeUnlock(event) {
        if (event.badgesUnlocked.length === 0) {
            return;
        }
        this.logger.log(`Processing badge unlocks for user ${event.userId}: ${event.badgesUnlocked.join(', ')}`);
        const stellarAccountId = await this.getUserStellarAccount(event.userId);
        if (!stellarAccountId) {
            this.logger.warn(`User ${event.userId} does not have a Stellar account ID`);
            return;
        }
        for (const badgeId of event.badgesUnlocked) {
            try {
                await this.unlockBadgeOnStellar(event.userId, stellarAccountId, badgeId, event.newLevel);
            }
            catch (error) {
                this.logger.error(`Failed to unlock badge ${badgeId} for user ${event.userId}:`, error);
            }
        }
    }
    async unlockBadgeOnStellar(userId, stellarAccountId, badgeId, level) {
        const transaction = {
            userId,
            stellarAccountId,
            badgeId,
            level,
            status: 'pending',
            createdAt: new Date(),
        };
        try {
            this.logger.log(`Initiating Stellar badge unlock: ${badgeId} for user ${userId} at level ${level}`);
            const transactionHash = await this.submitBadgeUnlockTransaction(stellarAccountId, badgeId, level);
            transaction.transactionHash = transactionHash;
            transaction.status = 'success';
            transaction.completedAt = new Date();
            this.logger.log(`Successfully unlocked badge ${badgeId} for user ${userId}. Transaction: ${transactionHash}`);
            const badgeUnlockedEvent = new badge_unlocked_event_1.BadgeUnlockedEvent(userId, badgeId, level, transactionHash);
            this.eventEmitter.emit('badge.unlocked', badgeUnlockedEvent);
        }
        catch (error) {
            transaction.status = 'failed';
            transaction.error =
                error instanceof Error ? error.message : 'Unknown error';
            transaction.completedAt = new Date();
            this.logger.error(`Failed to unlock badge ${badgeId} for user ${userId}:`, error);
            throw error;
        }
        return transaction;
    }
    async submitBadgeUnlockTransaction(stellarAccountId, badgeId, level) {
        const mockTransactionHash = `stellar_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return mockTransactionHash;
    }
    async getUserStellarAccount(userId) {
        return `GABC${userId.replace(/-/g, '').substring(0, 52).toUpperCase()}`;
    }
    async getBadgeUnlockStatus(userId, badgeId) {
        this.logger.log(`Checking badge unlock status for user ${userId}, badge ${badgeId}`);
        return null;
    }
    async retryFailedBadgeUnlock(transactionId) {
        throw new Error('Retry functionality not implemented yet');
    }
    async validateBadgeOwnership(stellarAccountId, badgeId) {
        this.logger.log(`Validating badge ownership: ${badgeId} for account ${stellarAccountId}`);
        return true;
    }
};
exports.StellarService = StellarService;
__decorate([
    (0, event_emitter_1.OnEvent)('level.up'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], StellarService.prototype, "handleLevelUpBadgeUnlock", null);
exports.StellarService = StellarService = StellarService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Object])
], StellarService);
//# sourceMappingURL=stellar.service.js.map