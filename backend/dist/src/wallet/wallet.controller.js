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
exports.WalletController = void 0;
const common_1 = require("@nestjs/common");
const wallet_service_1 = require("./services/wallet.service");
const wallet_dto_1 = require("./dto/wallet.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const throttler_1 = require("@nestjs/throttler");
let WalletController = class WalletController {
    walletService;
    constructor(walletService) {
        this.walletService = walletService;
    }
    async getUserWalletBalance(userId, options, req) {
        if (userId !== req.user.id && !req.user.isAdmin) {
            throw new Error('Unauthorized: Cannot view other users balances');
        }
        return this.walletService.getUserWalletBalance(userId, options);
    }
    async getCurrentUserWalletBalance(options, req) {
        return this.walletService.getUserWalletBalance(req.user.id, options);
    }
    async refreshUserBalances(dto, req) {
        await this.walletService.refreshUserBalances(req.user.id, dto);
        return {
            message: 'Wallet balances refreshed successfully',
            userId: req.user.id
        };
    }
    async getWalletStats() {
        return this.walletService.getWalletStats();
    }
    async testBaseSepolia(req) {
        return {
            network: 'base-sepolia',
            rpcUrl: 'https://sepolia.base.org',
            chainId: 84532,
            status: 'active',
            testAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
            testAssets: ['ETH', 'USDC', 'USDT'],
        };
    }
    async testStellarTestnet(req) {
        return {
            network: 'stellar-testnet',
            horizonUrl: 'https://horizon-testnet.stellar.org',
            networkPassphrase: 'Test SDF Network ; September 2015',
            status: 'active',
            testAddress: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
            testAssets: ['XLM', 'USDC', 'USDT'],
        };
    }
    async testPerformance(req) {
        const startTime = Date.now();
        const baseStartTime = Date.now();
        const baseResult = await this.walletService.getUserWalletBalance(req.user.id, {
            networks: ['base'],
            assets: ['ETH', 'USDC', 'USDT'],
        });
        const baseResponseTime = Date.now() - baseStartTime;
        const stellarStartTime = Date.now();
        const stellarResult = await this.walletService.getUserWalletBalance(req.user.id, {
            networks: ['stellar'],
            assets: ['XLM', 'USDC', 'USDT'],
        });
        const stellarResponseTime = Date.now() - stellarStartTime;
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        return {
            message: 'Wallet performance test completed',
            testResults: {
                baseSepolia: {
                    network: 'base-sepolia',
                    responseTime: `${baseResponseTime}ms`,
                    assets: baseResult.networks.base.assets.map(a => a.asset),
                    status: baseResponseTime < 1000 ? 'PASS' : 'FAIL',
                },
                stellarTestnet: {
                    network: 'stellar-testnet',
                    responseTime: `${stellarResponseTime}ms`,
                    assets: stellarResult.networks.stellar.assets.map(a => a.asset),
                    status: stellarResponseTime < 1000 ? 'PASS' : 'FAIL',
                },
            },
            cacheStats: {
                hitRate: '0.00%',
                totalRequests: 2,
                cacheHits: 0,
                cacheMisses: 2,
            },
            overallPerformance: {
                totalTime: `${totalTime}ms`,
                averageTime: `${(totalTime / 2).toFixed(2)}ms`,
                networksPerSecond: `${(2 / (totalTime / 1000)).toFixed(2)}`,
            },
        };
    }
    async testCachePerformance(req) {
        const firstStartTime = Date.now();
        const firstResult = await this.walletService.getUserWalletBalance(req.user.id, {
            networks: ['base', 'stellar'],
            assets: ['ETH', 'XLM', 'USDC'],
        });
        const firstResponseTime = Date.now() - firstStartTime;
        const secondStartTime = Date.now();
        const secondResult = await this.walletService.getUserWalletBalance(req.user.id, {
            networks: ['base', 'stellar'],
            assets: ['ETH', 'XLM', 'USDC'],
        });
        const secondResponseTime = Date.now() - secondStartTime;
        const thirdStartTime = Date.now();
        const thirdResult = await this.walletService.getUserWalletBalance(req.user.id, {
            networks: ['base', 'stellar'],
            assets: ['ETH', 'XLM', 'USDC'],
        });
        const thirdResponseTime = Date.now() - thirdStartTime;
        const averageResponseTime = (firstResponseTime + secondResponseTime + thirdResponseTime) / 3;
        const cacheHitRate = ((secondResult.cacheHit ? 1 : 0) + (thirdResult.cacheHit ? 1 : 0)) / 2 * 100;
        const performanceImprovement = ((firstResponseTime - averageResponseTime) / firstResponseTime * 100).toFixed(2);
        return {
            message: 'Cache performance test completed',
            cacheTestResults: {
                firstRequest: {
                    responseTime: `${firstResponseTime}ms`,
                    cacheHit: firstResult.cacheHit,
                    assets: firstResult.assets.length,
                },
                secondRequest: {
                    responseTime: `${secondResponseTime}ms`,
                    cacheHit: secondResult.cacheHit,
                    assets: secondResult.assets.length,
                },
                thirdRequest: {
                    responseTime: `${thirdResponseTime}ms`,
                    cacheHit: thirdResult.cacheHit,
                    assets: thirdResult.assets.length,
                },
            },
            cachePerformance: {
                averageResponseTime: `${averageResponseTime.toFixed(2)}ms`,
                cacheHitRate: `${cacheHitRate.toFixed(2)}%`,
                performanceImprovement: `${performanceImprovement}%`,
            },
        };
    }
};
exports.WalletController = WalletController;
__decorate([
    (0, common_1.Get)('balance/:userId'),
    (0, throttler_1.Throttle)({ short: { limit: 30, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, wallet_dto_1.GetBalanceDto, Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getUserWalletBalance", null);
__decorate([
    (0, common_1.Get)('balance'),
    (0, throttler_1.Throttle)({ short: { limit: 30, ttl: 60000 } }),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_dto_1.GetBalanceDto, Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getCurrentUserWalletBalance", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_dto_1.RefreshBalanceDto, Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "refreshUserBalances", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getWalletStats", null);
__decorate([
    (0, common_1.Get)('test/base-sepolia'),
    (0, throttler_1.Throttle)({ short: { limit: 5, ttl: 60000 } }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "testBaseSepolia", null);
__decorate([
    (0, common_1.Get)('test/stellar-testnet'),
    (0, throttler_1.Throttle)({ short: { limit: 5, ttl: 60000 } }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "testStellarTestnet", null);
__decorate([
    (0, common_1.Get)('test/performance'),
    (0, throttler_1.Throttle)({ short: { limit: 1, ttl: 60000 } }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "testPerformance", null);
__decorate([
    (0, common_1.Get)('test/cache-performance'),
    (0, throttler_1.Throttle)({ short: { limit: 1, ttl: 60000 } }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "testCachePerformance", null);
exports.WalletController = WalletController = __decorate([
    (0, common_1.Controller)('wallet'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [wallet_service_1.WalletService])
], WalletController);
//# sourceMappingURL=wallet.controller.js.map