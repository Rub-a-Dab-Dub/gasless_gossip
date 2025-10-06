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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let StellarController = class StellarController {
    stellarService;
    constructor(stellarService) {
        this.stellarService = stellarService;
    }
    async unlockBadge(userId, badgeId, body) {
        const stellarAccountId = `GABC${userId.replace(/-/g, '').substring(0, 52).toUpperCase()}`;
        return this.stellarService.unlockBadgeOnStellar(userId, stellarAccountId, badgeId, body.level);
    }
    async getBadgeUnlockStatus(userId, badgeId) {
        return this.stellarService.getBadgeUnlockStatus(userId, badgeId);
    }
    async validateBadgeOwnership(stellarAccountId, badgeId) {
        const owns = await this.stellarService.validateBadgeOwnership(stellarAccountId, badgeId);
        return {
            stellarAccountId,
            badgeId,
            owns,
        };
    }
    async retryTransaction(transactionId) {
        return this.stellarService.retryFailedBadgeUnlock(transactionId);
    }
};
exports.StellarController = StellarController;
__decorate([
    (0, common_1.Post)('badges/:userId/:badgeId/unlock'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Manually trigger badge unlock on Stellar' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID' }),
    (0, swagger_1.ApiParam)({ name: 'badgeId', description: 'Badge identifier' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Badge unlock initiated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found or no Stellar account',
    }),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], StellarController.prototype, "unlockBadge", null);
__decorate([
    (0, common_1.Get)('badges/:userId/:badgeId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get badge unlock transaction status' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID' }),
    (0, swagger_1.ApiParam)({ name: 'badgeId', description: 'Badge identifier' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Badge unlock status retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StellarController.prototype, "getBadgeUnlockStatus", null);
__decorate([
    (0, common_1.Get)('badges/:stellarAccountId/:badgeId/validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate badge ownership on Stellar network' }),
    (0, swagger_1.ApiParam)({ name: 'stellarAccountId', description: 'Stellar account ID' }),
    (0, swagger_1.ApiParam)({ name: 'badgeId', description: 'Badge identifier' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Badge ownership validation result',
        schema: {
            type: 'object',
            properties: {
                stellarAccountId: { type: 'string' },
                badgeId: { type: 'string' },
                owns: { type: 'boolean' },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StellarController.prototype, "validateBadgeOwnership", null);
__decorate([
    (0, common_1.Post)('transactions/:transactionId/retry'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Retry failed badge unlock transaction' }),
    (0, swagger_1.ApiParam)({ name: 'transactionId', description: 'Transaction ID to retry' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transaction retry initiated successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StellarController.prototype, "retryTransaction", null);
exports.StellarController = StellarController = __decorate([
    (0, swagger_1.ApiTags)('stellar'),
    (0, common_1.Controller)('stellar'),
    __metadata("design:paramtypes", [Function])
], StellarController);
//# sourceMappingURL=stellar.controller.js.map