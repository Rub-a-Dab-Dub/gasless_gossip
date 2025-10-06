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
var TransferLoggerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferLoggerService = void 0;
const common_1 = require("@nestjs/common");
let TransferLoggerService = TransferLoggerService_1 = class TransferLoggerService {
    nftRepository;
    transferHistoryRepository;
    stellarNftService;
    eventEmitter;
    logger = new common_1.Logger(TransferLoggerService_1.name);
    constructor(nftRepository, transferHistoryRepository, stellarNftService, eventEmitter) {
        this.nftRepository = nftRepository;
        this.transferHistoryRepository = transferHistoryRepository;
        this.stellarNftService = stellarNftService;
        this.eventEmitter = eventEmitter;
    }
    async logTransfer(entry) {
        try {
            this.logger.log(`Logging transfer for NFT ${entry.nftId}: ${entry.fromAddress} -> ${entry.toAddress}`);
            const transferHistory = this.transferHistoryRepository.create({
                nftId: entry.nftId,
                fromAddress: entry.fromAddress,
                toAddress: entry.toAddress,
                fromUserId: entry.fromUserId,
                toUserId: entry.toUserId,
                transactionId: entry.transactionId,
                blockNumber: entry.blockNumber,
                gasUsed: entry.gasUsed,
                transferType: entry.transferType,
                timestamp: entry.timestamp,
                metadata: entry.metadata,
            });
            await this.transferHistoryRepository.save(transferHistory);
            const nft = await this.nftRepository.findOne({ where: { id: entry.nftId } });
            if (nft) {
                const transferLog = {
                    from: entry.fromUserId || entry.fromAddress,
                    to: entry.toUserId || entry.toAddress,
                    timestamp: entry.timestamp,
                    transactionId: entry.transactionId,
                    blockNumber: entry.blockNumber,
                };
                nft.transferLogs.push(transferLog);
                await this.nftRepository.save(nft);
            }
            this.eventEmitter.emit("nft.transfer.logged", {
                nftId: entry.nftId,
                transferHistory,
            });
            this.logger.log(`Transfer logged successfully for NFT ${entry.nftId}`);
        }
        catch (error) {
            this.logger.error(`Failed to log transfer for NFT ${entry.nftId}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getTransferHistory(nftId) {
        return this.transferHistoryRepository.find({
            where: { nftId },
            order: { timestamp: "DESC" },
        });
    }
    async getTransferHistoryByUser(userId) {
        return this.transferHistoryRepository.find({
            where: [{ fromUserId: userId }, { toUserId: userId }],
            order: { timestamp: "DESC" },
        });
    }
    async getTransferHistoryByAddress(address) {
        return this.transferHistoryRepository.find({
            where: [{ fromAddress: address }, { toAddress: address }],
            order: { timestamp: "DESC" },
        });
    }
    async syncTransferFromStellar(transactionId) {
        try {
            this.logger.log(`Syncing transfer from Stellar transaction: ${transactionId}`);
            const txDetails = await this.stellarNftService.getTransactionDetails(transactionId);
            if (!txDetails) {
                throw new Error(`Transaction ${transactionId} not found on Stellar`);
            }
            const operations = txDetails.operations || [];
            for (const operation of operations) {
                if (operation.type === "payment" && operation.asset_type !== "native") {
                    const assetCode = operation.asset_code;
                    const assetIssuer = operation.asset_issuer;
                    const nft = await this.nftRepository.findOne({
                        where: {
                            stellarAssetCode: assetCode,
                            stellarAssetIssuer: assetIssuer,
                        },
                    });
                    if (nft) {
                        await this.logTransfer({
                            nftId: nft.id,
                            fromAddress: operation.from,
                            toAddress: operation.to,
                            transactionId: transactionId,
                            transferType: "transfer",
                            timestamp: new Date(txDetails.created_at),
                            metadata: {
                                stellarLedger: txDetails.ledger,
                                stellarPagingToken: txDetails.paging_token,
                            },
                        });
                    }
                }
            }
            this.logger.log(`Successfully synced transfer from Stellar transaction: ${transactionId}`);
        }
        catch (error) {
            this.logger.error(`Failed to sync transfer from Stellar: ${error.message}`, error.stack);
            throw error;
        }
    }
    async validateTransferIntegrity(nftId) {
        try {
            const nft = await this.nftRepository.findOne({ where: { id: nftId } });
            if (!nft) {
                return false;
            }
            const transferHistory = await this.getTransferHistory(nftId);
            if (nft.transferLogs.length !== transferHistory.length) {
                this.logger.warn(`Transfer log mismatch for NFT ${nftId}: ${nft.transferLogs.length} vs ${transferHistory.length}`);
                return false;
            }
            for (let i = 1; i < transferHistory.length; i++) {
                if (transferHistory[i].timestamp > transferHistory[i - 1].timestamp) {
                    this.logger.warn(`Transfer history out of order for NFT ${nftId}`);
                    return false;
                }
            }
            const lastTransfer = transferHistory[0];
            if (lastTransfer && lastTransfer.toUserId !== nft.userId) {
                this.logger.warn(`Ownership mismatch for NFT ${nftId}: ${lastTransfer.toUserId} vs ${nft.userId}`);
                return false;
            }
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to validate transfer integrity for NFT ${nftId}: ${error.message}`);
            return false;
        }
    }
    async getTransferStatistics(timeframe = "day") {
        const now = new Date();
        let startDate;
        switch (timeframe) {
            case "day":
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case "week":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "month":
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case "year":
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
        }
        const transfers = await this.transferHistoryRepository
            .createQueryBuilder("transfer")
            .where("transfer.timestamp >= :startDate", { startDate })
            .getMany();
        const stats = {
            totalTransfers: transfers.length,
            mints: transfers.filter((t) => t.transferType === "mint").length,
            transfers: transfers.filter((t) => t.transferType === "transfer").length,
            burns: transfers.filter((t) => t.transferType === "burn").length,
            uniqueNfts: new Set(transfers.map((t) => t.nftId)).size,
            uniqueUsers: new Set([
                ...transfers.map((t) => t.fromUserId).filter(Boolean),
                ...transfers.map((t) => t.toUserId).filter(Boolean),
            ]).size,
        };
        return stats;
    }
};
exports.TransferLoggerService = TransferLoggerService;
exports.TransferLoggerService = TransferLoggerService = TransferLoggerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Function, Function, Object])
], TransferLoggerService);
//# sourceMappingURL=transfer-logger.service.js.map