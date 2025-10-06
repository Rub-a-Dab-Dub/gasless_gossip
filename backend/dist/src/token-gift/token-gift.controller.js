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
exports.TokenGiftController = void 0;
const common_1 = require("@nestjs/common");
const token_gift_service_1 = require("./services/token-gift.service");
const token_gift_dto_1 = require("./dto/token-gift.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const throttler_1 = require("@nestjs/throttler");
let TokenGiftController = class TokenGiftController {
    tokenGiftService;
    constructor(tokenGiftService) {
        this.tokenGiftService = tokenGiftService;
    }
    async createTokenGift(dto, req) {
        return this.tokenGiftService.createTokenGift(dto, req.user.id);
    }
    async getTokenGift(giftId) {
        return this.tokenGiftService.getTokenGift(giftId);
    }
    async getUserTokenGifts(userId, limit, req) {
        if (userId !== req.user.id && !req.user.isAdmin) {
            throw new Error('Unauthorized: Cannot view other users gifts');
        }
        return this.tokenGiftService.getUserTokenGifts(userId, limit || 20);
    }
    async getTokenGiftTransactions(giftId) {
        return this.tokenGiftService.getTokenGiftTransactions(giftId);
    }
    async estimateGas(dto) {
        return this.tokenGiftService.getGasEstimate(dto);
    }
    async getPaymasterStatus(network) {
        return this.tokenGiftService.getPaymasterStatus(network);
    }
    async getPerformanceMetrics() {
        return this.tokenGiftService.getPerformanceMetrics();
    }
    async testStellarTestnet(dto, req) {
        const testDto = { ...dto, network: 'stellar' };
        return this.tokenGiftService.createTokenGift(testDto, req.user.id);
    }
    async testBaseSepolia(dto, req) {
        const testDto = { ...dto, network: 'base' };
        return this.tokenGiftService.createTokenGift(testDto, req.user.id);
    }
    async getStellarTestnetStatus() {
        return {
            network: 'stellar-testnet',
            horizonUrl: 'https://horizon-testnet.stellar.org',
            networkPassphrase: 'Test SDF Network ; September 2015',
            status: 'active',
        };
    }
    async getBaseSepoliaStatus() {
        return {
            network: 'base-sepolia',
            rpcUrl: 'https://sepolia.base.org',
            chainId: 84532,
            status: 'active',
        };
    }
    async simulateTransaction(dto) {
        const startTime = Date.now();
        const [estimatedGas, paymasterStatus] = await Promise.all([
            this.tokenGiftService.getGasEstimate(dto),
            this.tokenGiftService.getPaymasterStatus(dto.network),
        ]);
        const processingTime = Date.now() - startTime;
        return {
            simulated: true,
            estimatedGas,
            paymasterStatus,
            processingTime: `${processingTime}ms`,
        };
    }
};
exports.TokenGiftController = TokenGiftController;
__decorate([
    (0, common_1.Post)('token'),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [token_gift_dto_1.CreateTokenGiftDto, Object]),
    __metadata("design:returntype", Promise)
], TokenGiftController.prototype, "createTokenGift", null);
__decorate([
    (0, common_1.Get)('token/:giftId'),
    (0, throttler_1.Throttle)({ short: { limit: 30, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('giftId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TokenGiftController.prototype, "getTokenGift", null);
__decorate([
    (0, common_1.Get)('token/user/:userId'),
    (0, throttler_1.Throttle)({ short: { limit: 20, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], TokenGiftController.prototype, "getUserTokenGifts", null);
__decorate([
    (0, common_1.Get)('token/:giftId/transactions'),
    (0, throttler_1.Throttle)({ short: { limit: 30, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('giftId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TokenGiftController.prototype, "getTokenGiftTransactions", null);
__decorate([
    (0, common_1.Post)('token/estimate-gas'),
    (0, throttler_1.Throttle)({ short: { limit: 50, ttl: 60000 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [token_gift_dto_1.CreateTokenGiftDto]),
    __metadata("design:returntype", Promise)
], TokenGiftController.prototype, "estimateGas", null);
__decorate([
    (0, common_1.Get)('token/paymaster-status/:network'),
    (0, throttler_1.Throttle)({ short: { limit: 20, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('network')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TokenGiftController.prototype, "getPaymasterStatus", null);
__decorate([
    (0, common_1.Get)('token/performance'),
    (0, throttler_1.Throttle)({ short: { limit: 5, ttl: 60000 } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TokenGiftController.prototype, "getPerformanceMetrics", null);
__decorate([
    (0, common_1.Post)('test/stellar-testnet'),
    (0, throttler_1.Throttle)({ short: { limit: 5, ttl: 60000 } }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [token_gift_dto_1.CreateTokenGiftDto, Object]),
    __metadata("design:returntype", Promise)
], TokenGiftController.prototype, "testStellarTestnet", null);
__decorate([
    (0, common_1.Post)('test/base-sepolia'),
    (0, throttler_1.Throttle)({ short: { limit: 5, ttl: 60000 } }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [token_gift_dto_1.CreateTokenGiftDto, Object]),
    __metadata("design:returntype", Promise)
], TokenGiftController.prototype, "testBaseSepolia", null);
__decorate([
    (0, common_1.Get)('test/stellar-testnet/status'),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TokenGiftController.prototype, "getStellarTestnetStatus", null);
__decorate([
    (0, common_1.Get)('test/base-sepolia/status'),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TokenGiftController.prototype, "getBaseSepoliaStatus", null);
__decorate([
    (0, common_1.Post)('test/simulate-transaction'),
    (0, throttler_1.Throttle)({ short: { limit: 20, ttl: 60000 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [token_gift_dto_1.CreateTokenGiftDto]),
    __metadata("design:returntype", Promise)
], TokenGiftController.prototype, "simulateTransaction", null);
exports.TokenGiftController = TokenGiftController = __decorate([
    (0, common_1.Controller)('gift'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [token_gift_service_1.TokenGiftService])
], TokenGiftController);
//# sourceMappingURL=token-gift.controller.js.map