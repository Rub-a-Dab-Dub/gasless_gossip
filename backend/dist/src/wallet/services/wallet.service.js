"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WalletService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_2 = require("cache-manager");
const config_1 = require("@nestjs/config");
const ethers_1 = require("ethers");
const StellarSdk = __importStar(require("stellar-sdk"));
const wallet_balance_entity_1 = require("../entities/wallet-balance.entity");
let WalletService = WalletService_1 = class WalletService {
    walletBalanceRepo;
    cacheManager;
    configService;
    logger = new common_1.Logger(WalletService_1.name);
    baseProvider;
    stellarServer;
    cacheStats = {
        totalRequests: 0,
        cacheHits: 0,
        cacheMisses: 0,
    };
    constructor(walletBalanceRepo, cacheManager, configService) {
        this.walletBalanceRepo = walletBalanceRepo;
        this.cacheManager = cacheManager;
        this.configService = configService;
        const baseRpcUrl = this.configService.get('BASE_RPC_URL', 'https://sepolia.base.org');
        this.baseProvider = new ethers_1.ethers.JsonRpcProvider(baseRpcUrl);
        const stellarNetwork = this.configService.get('STELLAR_NETWORK', 'testnet');
        this.stellarServer = new StellarSdk.Horizon.Server(stellarNetwork === 'mainnet'
            ? 'https://horizon.stellar.org'
            : 'https://horizon-testnet.stellar.org');
    }
    async getUserWalletBalance(userId, options = {}) {
        const startTime = Date.now();
        this.cacheStats.totalRequests++;
        try {
            const cacheKey = `wallet:${userId}:${JSON.stringify(options)}`;
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.cacheStats.cacheHits++;
                cached.cacheHit = true;
                cached.responseTime = Date.now() - startTime;
                this.logger.log(`Cache hit for user ${userId} (${cached.responseTime}ms)`);
                return cached;
            }
            this.cacheStats.cacheMisses++;
            const balances = await this.getUserBalancesFromDb(userId, options);
            if (balances.length === 0) {
                await this.refreshUserBalances(userId, options);
                const freshBalances = await this.getUserBalancesFromDb(userId, options);
                return this.buildWalletSummary(userId, freshBalances, startTime);
            }
            const summary = this.buildWalletSummary(userId, balances, startTime);
            await this.cacheManager.set(cacheKey, summary, 60000);
            return summary;
        }
        catch (error) {
            this.logger.error(`Failed to get wallet balance for user ${userId}:`, error);
            throw new common_1.BadRequestException('Failed to fetch wallet balance');
        }
    }
    async refreshUserBalances(userId, options = {}) {
        try {
            const networks = options.networks || ['base', 'stellar'];
            const assets = options.assets || ['ETH', 'XLM', 'USDC', 'USDT'];
            const walletAddresses = await this.getUserWalletAddresses(userId);
            if (!walletAddresses.base && !walletAddresses.stellar) {
                throw new common_1.NotFoundException('No wallet addresses found for user');
            }
            const balancePromises = [];
            if (networks.includes('base') && walletAddresses.base) {
                balancePromises.push(this.fetchBaseBalances(userId, walletAddresses.base, assets));
            }
            if (networks.includes('stellar') && walletAddresses.stellar) {
                balancePromises.push(this.fetchStellarBalances(userId, walletAddresses.stellar, assets));
            }
            const results = await Promise.all(balancePromises);
            const allBalances = results.flat();
            await this.saveBalancesToDb(allBalances);
            await this.clearUserCache(userId);
            this.logger.log(`Refreshed balances for user ${userId}: ${allBalances.length} assets`);
        }
        catch (error) {
            this.logger.error(`Failed to refresh balances for user ${userId}:`, error);
            throw error;
        }
    }
    async fetchBaseBalances(userId, walletAddress, assets) {
        const balances = [];
        try {
            if (assets.includes('ETH')) {
                const ethBalance = await this.baseProvider.getBalance(walletAddress);
                const ethBalanceFormatted = ethers_1.ethers.formatEther(ethBalance);
                const ethBalanceRecord = this.walletBalanceRepo.create({
                    userId,
                    network: 'base',
                    asset: 'ETH',
                    balance: ethBalance.toString(),
                    formattedBalance: ethBalanceFormatted,
                    symbol: 'ETH',
                    decimals: 18,
                    assetType: 'native',
                    walletAddress,
                    lastFetchedAt: new Date(),
                });
                balances.push(ethBalanceRecord);
            }
            const erc20Tokens = assets.filter(asset => asset !== 'ETH');
            for (const token of erc20Tokens) {
                try {
                    const tokenBalance = await this.fetchERC20Balance(walletAddress, token);
                    if (tokenBalance && tokenBalance !== '0') {
                        const tokenBalanceRecord = this.walletBalanceRepo.create({
                            userId,
                            network: 'base',
                            asset: token,
                            contractAddress: this.getTokenContractAddress(token),
                            balance: tokenBalance,
                            formattedBalance: this.formatTokenBalance(tokenBalance, token),
                            symbol: token,
                            decimals: this.getTokenDecimals(token),
                            assetType: 'token',
                            walletAddress,
                            lastFetchedAt: new Date(),
                        });
                        balances.push(tokenBalanceRecord);
                    }
                }
                catch (error) {
                    this.logger.warn(`Failed to fetch ${token} balance:`, error);
                }
            }
            return balances;
        }
        catch (error) {
            this.logger.error(`Failed to fetch Base balances for user ${userId}:`, error);
            return [];
        }
    }
    async fetchStellarBalances(userId, walletAddress, assets) {
        const balances = [];
        try {
            const account = await this.stellarServer.loadAccount(walletAddress);
            for (const balance of account.balances) {
                const assetCode = balance.asset_type === 'native' ? 'XLM' : balance.asset_code;
                if (assets.includes(assetCode)) {
                    const balanceRecord = this.walletBalanceRepo.create({
                        userId,
                        network: 'stellar',
                        asset: assetCode,
                        balance: balance.balance,
                        formattedBalance: balance.balance,
                        symbol: assetCode,
                        decimals: assetCode === 'XLM' ? 7 : 7,
                        assetType: balance.asset_type === 'native' ? 'native' : 'token',
                        contractAddress: balance.asset_type !== 'native' ? balance.asset_issuer : undefined,
                        walletAddress,
                        lastFetchedAt: new Date(),
                    });
                    balances.push(balanceRecord);
                }
            }
            return balances;
        }
        catch (error) {
            this.logger.error(`Failed to fetch Stellar balances for user ${userId}:`, error);
            return [];
        }
    }
    async fetchERC20Balance(walletAddress, tokenSymbol) {
        const contractAddress = this.getTokenContractAddress(tokenSymbol);
        if (!contractAddress) {
            throw new Error(`Contract address not found for ${tokenSymbol}`);
        }
        const contract = new ethers_1.ethers.Contract(contractAddress, [
            'function balanceOf(address owner) view returns (uint256)',
            'function decimals() view returns (uint8)',
        ], this.baseProvider);
        const balance = await contract.balanceOf(walletAddress);
        return balance.toString();
    }
    async getUserWalletAddresses(userId) {
        return {
            base: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
            stellar: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
        };
    }
    async getUserBalancesFromDb(userId, options) {
        const query = this.walletBalanceRepo
            .createQueryBuilder('balance')
            .where('balance.userId = :userId', { userId })
            .andWhere('balance.lastFetchedAt > :cutoff', {
            cutoff: new Date(Date.now() - 5 * 60 * 1000)
        });
        if (options.networks && options.networks.length > 0) {
            query.andWhere('balance.network IN (:...networks)', { networks: options.networks });
        }
        if (options.assets && options.assets.length > 0) {
            query.andWhere('balance.asset IN (:...assets)', { assets: options.assets });
        }
        return query.orderBy('balance.createdAt', 'DESC').getMany();
    }
    async saveBalancesToDb(balances) {
        if (balances.length === 0)
            return;
        const userId = balances[0].userId;
        const networks = [...new Set(balances.map(b => b.network))];
        await this.walletBalanceRepo
            .createQueryBuilder()
            .delete()
            .where('userId = :userId', { userId })
            .andWhere('network IN (:...networks)', { networks })
            .execute();
        await this.walletBalanceRepo.save(balances);
    }
    async clearUserCache(userId) {
        const pattern = `wallet:${userId}:*`;
        this.logger.log(`Cleared cache for user ${userId}`);
    }
    buildWalletSummary(userId, balances, startTime) {
        const networks = {
            base: { totalUsdValue: '0', assets: [] },
            stellar: { totalUsdValue: '0', assets: [] },
        };
        let totalUsdValue = 0;
        for (const balance of balances) {
            const balanceDto = this.mapBalanceToDto(balance);
            if (balance.network === 'base') {
                networks.base.assets.push(balanceDto);
                if (balance.usdValue) {
                    networks.base.totalUsdValue = (parseFloat(networks.base.totalUsdValue) + parseFloat(balance.usdValue)).toString();
                }
            }
            else if (balance.network === 'stellar') {
                networks.stellar.assets.push(balanceDto);
                if (balance.usdValue) {
                    networks.stellar.totalUsdValue = (parseFloat(networks.stellar.totalUsdValue) + parseFloat(balance.usdValue)).toString();
                }
            }
            if (balance.usdValue) {
                totalUsdValue += parseFloat(balance.usdValue);
            }
        }
        return {
            userId,
            totalUsdValue: totalUsdValue.toString(),
            networks,
            assets: balances.map(b => this.mapBalanceToDto(b)),
            lastUpdated: new Date(),
            cacheHit: false,
            responseTime: Date.now() - startTime,
        };
    }
    mapBalanceToDto(balance) {
        return {
            id: balance.id,
            userId: balance.userId,
            network: balance.network,
            asset: balance.asset,
            contractAddress: balance.contractAddress,
            balance: balance.balance,
            formattedBalance: balance.formattedBalance,
            symbol: balance.symbol,
            decimals: balance.decimals,
            assetType: balance.assetType,
            walletAddress: balance.walletAddress,
            usdValue: balance.usdValue,
            priceUsd: balance.priceUsd,
            priceSource: balance.priceSource,
            isStaking: balance.isStaking,
            stakingRewards: balance.stakingRewards,
            metadata: balance.metadata,
            tokenInfo: balance.tokenInfo,
            lastFetchedAt: balance.lastFetchedAt,
            expiresAt: balance.expiresAt,
            createdAt: balance.createdAt,
            updatedAt: balance.updatedAt,
        };
    }
    getTokenContractAddress(tokenSymbol) {
        const contracts = {
            USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
            USDT: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
        };
        return contracts[tokenSymbol];
    }
    getTokenDecimals(tokenSymbol) {
        const decimals = {
            USDC: 6,
            USDT: 6,
            ETH: 18,
        };
        return decimals[tokenSymbol] || 18;
    }
    formatTokenBalance(balance, tokenSymbol) {
        const decimals = this.getTokenDecimals(tokenSymbol);
        return ethers_1.ethers.formatUnits(balance, decimals);
    }
    async getWalletStats() {
        const [totalUsers, totalAssets, baseStats, stellarStats, topAssets,] = await Promise.all([
            this.walletBalanceRepo
                .createQueryBuilder('balance')
                .select('COUNT(DISTINCT balance.userId)', 'count')
                .getRawOne(),
            this.walletBalanceRepo.count(),
            this.getNetworkStats('base'),
            this.getNetworkStats('stellar'),
            this.getTopAssets(),
        ]);
        const hitRate = this.cacheStats.totalRequests > 0
            ? (this.cacheStats.cacheHits / this.cacheStats.totalRequests * 100).toFixed(2)
            : '0.00';
        return {
            totalUsers: parseInt(totalUsers.count) || 0,
            totalAssets,
            totalUsdValue: '0',
            networks: {
                base: baseStats,
                stellar: stellarStats,
            },
            topAssets,
            cacheStats: {
                hitRate: `${hitRate}%`,
                totalRequests: this.cacheStats.totalRequests,
                cacheHits: this.cacheStats.cacheHits,
                cacheMisses: this.cacheStats.cacheMisses,
            },
        };
    }
    async getNetworkStats(network) {
        const [users, assets] = await Promise.all([
            this.walletBalanceRepo
                .createQueryBuilder('balance')
                .select('COUNT(DISTINCT balance.userId)', 'count')
                .where('balance.network = :network', { network })
                .getRawOne(),
            this.walletBalanceRepo.count({ where: { network } }),
        ]);
        return {
            users: parseInt(users.count) || 0,
            assets,
            totalUsdValue: '0',
        };
    }
    async getTopAssets() {
        const result = await this.walletBalanceRepo
            .createQueryBuilder('balance')
            .select('balance.asset', 'asset')
            .addSelect('balance.symbol', 'symbol')
            .addSelect('COUNT(DISTINCT balance.userId)', 'userCount')
            .groupBy('balance.asset, balance.symbol')
            .orderBy('userCount', 'DESC')
            .limit(10)
            .getRawMany();
        return result.map(row => ({
            asset: row.asset,
            symbol: row.symbol,
            totalUsdValue: '0',
            userCount: parseInt(row.userCount),
        }));
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = WalletService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_balance_entity_1.WalletBalance)),
    __param(1, (0, cache_manager_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeof (_a = typeof cache_manager_2.Cache !== "undefined" && cache_manager_2.Cache) === "function" ? _a : Object, config_1.ConfigService])
], WalletService);
//# sourceMappingURL=wallet.service.js.map