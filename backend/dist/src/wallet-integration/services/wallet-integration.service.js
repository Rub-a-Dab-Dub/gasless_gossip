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
var WalletIntegrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletIntegrationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const StellarSdk = __importStar(require("stellar-sdk"));
const wallet_connection_entity_1 = require("../entities/wallet-connection.entity");
let WalletIntegrationService = WalletIntegrationService_1 = class WalletIntegrationService {
    walletConnectionRepository;
    configService;
    logger = new common_1.Logger(WalletIntegrationService_1.name);
    server;
    networkPassphrase;
    constructor(walletConnectionRepository, configService) {
        this.walletConnectionRepository = walletConnectionRepository;
        this.configService = configService;
        const horizonUrl = this.configService.get('STELLAR_HORIZON_URL', 'https://horizon-testnet.stellar.org');
        const network = this.configService.get('STELLAR_NETWORK', 'testnet');
        this.server = new StellarSdk.Server(horizonUrl);
        this.networkPassphrase = network === 'testnet'
            ? StellarSdk.Networks.TESTNET
            : StellarSdk.Networks.PUBLIC;
    }
    async connectWallet(userId, connectWalletDto) {
        const { walletType, address, publicKey, signature, metadata } = connectWalletDto;
        const existingConnection = await this.walletConnectionRepository.findOne({
            where: { address }
        });
        if (existingConnection) {
            throw new common_1.ConflictException('Wallet address is already connected');
        }
        const authResult = await this.validateWalletAuth(walletType, address, publicKey, signature);
        if (!authResult.success) {
            throw new common_1.BadRequestException(`Wallet validation failed: ${authResult.error}`);
        }
        const walletConnection = this.walletConnectionRepository.create({
            userId,
            walletType,
            address: authResult.address,
            publicKey: authResult.publicKey,
            signature: authResult.signature,
            status: wallet_connection_entity_1.ConnectionStatus.ACTIVE,
            metadata: {
                ...metadata,
                connectedAt: new Date().toISOString(),
                walletVersion: this.getWalletVersion(walletType)
            }
        });
        const savedConnection = await this.walletConnectionRepository.save(walletConnection);
        this.logger.log(`Wallet connected: ${walletType} - ${address} for user ${userId}`);
        return savedConnection;
    }
    async getUserWallets(userId) {
        return this.walletConnectionRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }
    async getWalletById(walletId, userId) {
        const wallet = await this.walletConnectionRepository.findOne({
            where: { id: walletId, userId }
        });
        if (!wallet) {
            throw new common_1.NotFoundException('Wallet not found');
        }
        return wallet;
    }
    async disconnectWallet(walletId, userId) {
        const wallet = await this.getWalletById(walletId, userId);
        await this.walletConnectionRepository.update(walletId, {
            status: wallet_connection_entity_1.ConnectionStatus.DISCONNECTED
        });
        this.logger.log(`Wallet disconnected: ${wallet.walletType} - ${wallet.address}`);
    }
    async sendTransaction(walletId, userId, transactionDto) {
        const wallet = await this.getWalletById(walletId, userId);
        if (wallet.status !== wallet_connection_entity_1.ConnectionStatus.ACTIVE) {
            throw new common_1.BadRequestException('Wallet is not active');
        }
        try {
            const result = await this.processStellarTransaction(wallet, transactionDto);
            await this.walletConnectionRepository.update(walletId, {
                lastUsedAt: new Date()
            });
            return result;
        }
        catch (error) {
            this.logger.error(`Transaction failed for wallet ${walletId}:`, error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    async getWalletBalance(walletId, userId) {
        const wallet = await this.getWalletById(walletId, userId);
        try {
            const account = await this.server.loadAccount(wallet.address);
            return account.balances.map(balance => ({
                assetCode: balance.asset_type === 'native' ? 'XLM' : balance.asset_code,
                balance: balance.balance,
                limit: balance.limit
            }));
        }
        catch (error) {
            this.logger.error(`Failed to get balance for wallet ${walletId}:`, error);
            throw new common_1.BadRequestException('Failed to retrieve wallet balance');
        }
    }
    async getWalletStats(userId) {
        const wallets = await this.getUserWallets(userId);
        const stats = {
            totalWallets: wallets.length,
            activeWallets: wallets.filter(w => w.status === wallet_connection_entity_1.ConnectionStatus.ACTIVE).length,
            walletTypes: {},
            lastConnectedAt: wallets.length > 0 ? wallets[0].createdAt : null
        };
        Object.values(wallet_connection_entity_1.WalletType).forEach(type => {
            stats.walletTypes[type] = wallets.filter(w => w.walletType === type).length;
        });
        return stats;
    }
    async validateWalletAuth(walletType, address, publicKey, signature) {
        try {
            switch (walletType) {
                case wallet_connection_entity_1.WalletType.ALBEDO:
                    return await this.validateAlbedoAuth(address, publicKey, signature);
                case wallet_connection_entity_1.WalletType.FREIGHTER:
                    return await this.validateFreighterAuth(address, publicKey, signature);
                case wallet_connection_entity_1.WalletType.RABET:
                    return await this.validateRabetAuth(address, publicKey, signature);
                case wallet_connection_entity_1.WalletType.LUMENS:
                    return await this.validateLumensAuth(address, publicKey, signature);
                default:
                    return { success: false, error: 'Unsupported wallet type' };
            }
        }
        catch (error) {
            this.logger.error(`Wallet validation failed for ${walletType}:`, error);
            return { success: false, error: error.message };
        }
    }
    async validateAlbedoAuth(address, publicKey, signature) {
        if (!this.isValidStellarAddress(address)) {
            return { success: false, error: 'Invalid Stellar address' };
        }
        return {
            success: true,
            address,
            publicKey: publicKey || address,
            signature
        };
    }
    async validateFreighterAuth(address, publicKey, signature) {
        if (!this.isValidStellarAddress(address)) {
            return { success: false, error: 'Invalid Stellar address' };
        }
        return {
            success: true,
            address,
            publicKey: publicKey || address,
            signature
        };
    }
    async validateRabetAuth(address, publicKey, signature) {
        if (!this.isValidStellarAddress(address)) {
            return { success: false, error: 'Invalid Stellar address' };
        }
        return {
            success: true,
            address,
            publicKey: publicKey || address,
            signature
        };
    }
    async validateLumensAuth(address, publicKey, signature) {
        if (!this.isValidStellarAddress(address)) {
            return { success: false, error: 'Invalid Stellar address' };
        }
        return {
            success: true,
            address,
            publicKey: publicKey || address,
            signature
        };
    }
    async processStellarTransaction(wallet, transactionDto) {
        try {
            const mockTransactionId = `stellar_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            this.logger.log(`Simulated transaction: ${transactionDto.amount} ${transactionDto.assetCode} from ${wallet.address} to ${transactionDto.toAddress}`);
            return {
                success: true,
                transactionId: mockTransactionId,
                ledger: Math.floor(Math.random() * 1000000) + 50000000
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    isValidStellarAddress(address) {
        return /^G[0-9A-Z]{55}$/.test(address);
    }
    getWalletVersion(walletType) {
        const versions = {
            [wallet_connection_entity_1.WalletType.ALBEDO]: '1.0.0',
            [wallet_connection_entity_1.WalletType.FREIGHTER]: '2.0.0',
            [wallet_connection_entity_1.WalletType.RABET]: '1.5.0',
            [wallet_connection_entity_1.WalletType.LUMENS]: '1.0.0'
        };
        return versions[walletType] || '1.0.0';
    }
};
exports.WalletIntegrationService = WalletIntegrationService;
exports.WalletIntegrationService = WalletIntegrationService = WalletIntegrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_connection_entity_1.WalletConnection)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], WalletIntegrationService);
//# sourceMappingURL=wallet-integration.service.js.map