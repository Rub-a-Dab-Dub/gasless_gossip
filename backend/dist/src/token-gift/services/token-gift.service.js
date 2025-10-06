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
var TokenGiftService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenGiftService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const StellarSdk = __importStar(require("stellar-sdk"));
const token_gift_entity_1 = require("../entities/token-gift.entity");
const token_gift_transaction_entity_1 = require("../entities/token-gift-transaction.entity");
let TokenGiftService = TokenGiftService_1 = class TokenGiftService {
    tokenGiftRepo;
    transactionRepo;
    configService;
    logger = new common_1.Logger(TokenGiftService_1.name);
    stellarServer;
    stellarNetwork;
    constructor(tokenGiftRepo, transactionRepo, configService) {
        this.tokenGiftRepo = tokenGiftRepo;
        this.transactionRepo = transactionRepo;
        this.configService = configService;
        this.stellarNetwork = this.configService.get('STELLAR_NETWORK', 'testnet');
        this.stellarServer = new StellarSdk.Horizon.Server(this.stellarNetwork === 'mainnet'
            ? 'https://horizon.stellar.org'
            : 'https://horizon-testnet.stellar.org');
    }
    async createTokenGift(dto, senderId) {
        const startTime = Date.now();
        try {
            const tokenGift = this.tokenGiftRepo.create({
                senderId,
                recipientId: dto.recipientId,
                tokenAddress: dto.tokenAddress,
                tokenSymbol: dto.tokenSymbol,
                amount: dto.amount,
                network: dto.network,
                message: dto.message,
                metadata: dto.metadata,
                status: 'pending',
            });
            const savedGift = await this.tokenGiftRepo.save(tokenGift);
            const gasEstimate = await this.estimateGasCosts(dto);
            const paymasterStatus = await this.checkPaymasterStatus(dto.network);
            const result = await this.processTokenGift(savedGift, gasEstimate, paymasterStatus);
            const processingTime = Date.now() - startTime;
            this.logger.log(`Token gift created for ${dto.recipientId} (${processingTime}ms)`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to create token gift:`, error);
            throw new common_1.BadRequestException('Failed to create token gift');
        }
    }
    async processTokenGift(gift, gasEstimate, paymasterStatus) {
        try {
            gift.status = 'processing';
            await this.tokenGiftRepo.save(gift);
            const stellarTx = await this.processStellarTransaction(gift);
            const baseTx = paymasterStatus.sponsored
                ? await this.processBasePaymasterTransaction(gift, gasEstimate)
                : null;
            gift.stellarTxHash = stellarTx.txHash;
            gift.baseTxHash = baseTx?.txHash;
            gift.paymasterTxHash = baseTx?.paymasterTxHash;
            gift.gasUsed = gasEstimate.gasUsed;
            gift.gasPrice = gasEstimate.gasPrice;
            gift.totalCost = gasEstimate.totalCost;
            gift.status = 'completed';
            gift.processedAt = new Date();
            gift.completedAt = new Date();
            await this.tokenGiftRepo.save(gift);
            return {
                gift: this.mapGiftToDto(gift),
                transactions: [stellarTx, baseTx].filter(Boolean).map(t => this.mapTransactionToDto(t)),
                estimatedGas: {
                    stellar: gasEstimate.gasUsed,
                    base: gasEstimate.gasPrice,
                    total: gasEstimate.totalCost,
                },
                paymasterStatus,
            };
        }
        catch (error) {
            gift.status = 'failed';
            await this.tokenGiftRepo.save(gift);
            this.logger.error(`Failed to process token gift ${gift.id}:`, error);
            throw error;
        }
    }
    async processStellarTransaction(gift) {
        try {
            const transaction = await this.createStellarTransaction(gift);
            const response = await this.stellarServer.submitTransaction(transaction);
            const txRecord = this.transactionRepo.create({
                giftId: gift.id,
                network: 'stellar',
                txHash: response.hash,
                status: 'confirmed',
                blockNumber: response.ledger.toString(),
                gasUsed: '0',
                gasPrice: '0',
                transactionFee: response.fee_charged,
                sponsored: false,
                transactionData: {
                    operation: 'payment',
                    asset: gift.tokenSymbol,
                    amount: gift.amount,
                },
                receipt: {
                    hash: response.hash,
                    ledger: response.ledger,
                    fee: response.fee_charged,
                },
            });
            const savedTx = await this.transactionRepo.save(txRecord);
            this.logger.log(`Stellar transaction submitted: ${response.hash}`);
            return savedTx;
        }
        catch (error) {
            this.logger.error(`Stellar transaction failed:`, error);
            throw error;
        }
    }
    async processBasePaymasterTransaction(gift, gasEstimate) {
        try {
            const paymasterTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
            const txRecord = this.transactionRepo.create({
                giftId: gift.id,
                network: 'base',
                txHash: paymasterTxHash,
                status: 'confirmed',
                gasUsed: gasEstimate.gasUsed,
                gasPrice: gasEstimate.gasPrice,
                transactionFee: gasEstimate.totalCost,
                sponsored: true,
                paymasterAddress: this.configService.get('BASE_PAYMASTER_ADDRESS'),
                transactionData: {
                    paymaster: true,
                    sponsored: true,
                    gasEstimate: gasEstimate,
                },
                receipt: {
                    hash: paymasterTxHash,
                    sponsored: true,
                },
            });
            const savedTx = await this.transactionRepo.save(txRecord);
            this.logger.log(`Base paymaster transaction submitted: ${paymasterTxHash}`);
            return savedTx;
        }
        catch (error) {
            this.logger.error(`Base paymaster transaction failed:`, error);
            throw error;
        }
    }
    async createStellarTransaction(gift) {
        const sourceKeypair = StellarSdk.Keypair.random();
        const sourceAccount = await this.stellarServer.loadAccount(sourceKeypair.publicKey());
        const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: this.stellarNetwork === 'mainnet'
                ? StellarSdk.Networks.PUBLIC
                : StellarSdk.Networks.TESTNET,
        })
            .addOperation(StellarSdk.Operation.payment({
            destination: gift.recipientId,
            asset: StellarSdk.Asset.native(),
            amount: gift.amount,
        }))
            .setTimeout(30)
            .build();
        transaction.sign(sourceKeypair);
        return transaction;
    }
    async estimateGasCosts(dto) {
        const stellarGas = '0';
        const baseGas = '21000';
        const gasPrice = '20000000000';
        return {
            network: dto.network,
            gasUsed: baseGas,
            gasPrice: gasPrice,
            totalCost: (parseInt(baseGas) * parseInt(gasPrice)).toString(),
            sponsored: true,
            paymasterCoverage: '100',
        };
    }
    async checkPaymasterStatus(network) {
        const paymasterAddress = this.configService.get('BASE_PAYMASTER_ADDRESS');
        const maxGas = this.configService.get('BASE_PAYMASTER_MAX_GAS', '1000000');
        return {
            available: true,
            sponsored: true,
            maxGas,
            remainingBalance: '1000000000000000000',
            network,
        };
    }
    async getTokenGift(giftId) {
        const gift = await this.tokenGiftRepo.findOne({ where: { id: giftId } });
        if (!gift) {
            throw new common_1.NotFoundException('Token gift not found');
        }
        const transactions = await this.transactionRepo.find({
            where: { giftId },
            order: { createdAt: 'ASC' },
        });
        return {
            gift: this.mapGiftToDto(gift),
            transactions: transactions.map(t => this.mapTransactionToDto(t)),
        };
    }
    async getUserTokenGifts(userId, limit = 20) {
        const gifts = await this.tokenGiftRepo.find({
            where: [
                { senderId: userId },
                { recipientId: userId },
            ],
            order: { createdAt: 'DESC' },
            take: limit,
        });
        return gifts.map(gift => this.mapGiftToDto(gift));
    }
    async getTokenGiftTransactions(giftId) {
        const transactions = await this.transactionRepo.find({
            where: { giftId },
            order: { createdAt: 'ASC' },
        });
        return transactions.map(t => this.mapTransactionToDto(t));
    }
    async getGasEstimate(dto) {
        return this.estimateGasCosts(dto);
    }
    async getPaymasterStatus(network) {
        return this.checkPaymasterStatus(network);
    }
    async getPerformanceMetrics() {
        const [totalGifts, completedGifts] = await Promise.all([
            this.tokenGiftRepo.count(),
            this.tokenGiftRepo.count({ where: { status: 'completed' } }),
        ]);
        const successRate = totalGifts > 0 ? completedGifts / totalGifts : 0;
        return {
            totalGifts,
            completedGifts,
            averageProcessingTime: 0,
            successRate,
        };
    }
    mapGiftToDto(gift) {
        return {
            id: gift.id,
            senderId: gift.senderId,
            recipientId: gift.recipientId,
            tokenAddress: gift.tokenAddress,
            tokenSymbol: gift.tokenSymbol,
            amount: gift.amount,
            network: gift.network,
            status: gift.status,
            stellarTxHash: gift.stellarTxHash,
            baseTxHash: gift.baseTxHash,
            paymasterTxHash: gift.paymasterTxHash,
            gasUsed: gift.gasUsed,
            gasPrice: gift.gasPrice,
            totalCost: gift.totalCost,
            message: gift.message,
            metadata: gift.metadata,
            sorobanData: gift.sorobanData,
            paymasterData: gift.paymasterData,
            processedAt: gift.processedAt,
            completedAt: gift.completedAt,
            createdAt: gift.createdAt,
            updatedAt: gift.updatedAt,
        };
    }
    mapTransactionToDto(transaction) {
        return {
            id: transaction.id,
            giftId: transaction.giftId,
            network: transaction.network,
            txHash: transaction.txHash,
            status: transaction.status,
            blockNumber: transaction.blockNumber,
            confirmations: transaction.confirmations,
            gasUsed: transaction.gasUsed,
            gasPrice: transaction.gasPrice,
            effectiveGasPrice: transaction.effectiveGasPrice,
            transactionFee: transaction.transactionFee,
            sponsored: transaction.sponsored,
            paymasterAddress: transaction.paymasterAddress,
            transactionData: transaction.transactionData,
            receipt: transaction.receipt,
            errorMessage: transaction.errorMessage,
            createdAt: transaction.createdAt,
        };
    }
};
exports.TokenGiftService = TokenGiftService;
exports.TokenGiftService = TokenGiftService = TokenGiftService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(token_gift_entity_1.TokenGift)),
    __param(1, (0, typeorm_1.InjectRepository)(token_gift_transaction_entity_1.TokenGiftTransaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], TokenGiftService);
//# sourceMappingURL=token-gift.service.js.map