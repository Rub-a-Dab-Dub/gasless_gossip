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
var TransferLoggerListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferLoggerListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let TransferLoggerListener = TransferLoggerListener_1 = class TransferLoggerListener {
    transferLoggerService;
    logger = new common_1.Logger(TransferLoggerListener_1.name);
    constructor(transferLoggerService) {
        this.transferLoggerService = transferLoggerService;
    }
    async handleNftMinted(event) {
        try {
            this.logger.log(`Handling NFT minted event for NFT ${event.nft.id}`);
            await this.transferLoggerService.logTransfer({
                nftId: event.nft.id,
                fromAddress: "mint",
                toAddress: event.nft.user?.stellarAccountId || "unknown",
                toUserId: event.nft.userId,
                transactionId: event.nft.txId,
                transferType: "mint",
                timestamp: event.nft.createdAt,
                metadata: {
                    mintPrice: event.nft.mintPrice,
                    collectionId: event.nft.collectionId,
                },
            });
        }
        catch (error) {
            this.logger.error(`Failed to log NFT mint: ${error.message}`, error.stack);
        }
    }
    async handleNftTransferred(event) {
        try {
            this.logger.log(`Handling NFT transferred event for NFT ${event.nft.id}`);
            const latestTransferLog = event.nft.transferLogs[event.nft.transferLogs.length - 1];
            await this.transferLoggerService.logTransfer({
                nftId: event.nft.id,
                fromAddress: "unknown",
                toAddress: "unknown",
                fromUserId: event.fromUserId,
                toUserId: event.toUserId,
                transactionId: latestTransferLog.transactionId,
                transferType: "transfer",
                timestamp: latestTransferLog.timestamp,
                metadata: {
                    previousOwner: event.fromUserId,
                    newOwner: event.toUserId,
                },
            });
        }
        catch (error) {
            this.logger.error(`Failed to log NFT transfer: ${error.message}`, error.stack);
        }
    }
    async handleTransferLogged(event) {
        this.logger.log(`Transfer logged for NFT ${event.nftId}`);
    }
};
exports.TransferLoggerListener = TransferLoggerListener;
__decorate([
    (0, event_emitter_1.OnEvent)("nft.minted"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], TransferLoggerListener.prototype, "handleNftMinted", null);
__decorate([
    (0, event_emitter_1.OnEvent)("nft.transferred"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], TransferLoggerListener.prototype, "handleNftTransferred", null);
__decorate([
    (0, event_emitter_1.OnEvent)("nft.transfer.logged"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransferLoggerListener.prototype, "handleTransferLogged", null);
exports.TransferLoggerListener = TransferLoggerListener = TransferLoggerListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function])
], TransferLoggerListener);
//# sourceMappingURL=transfer-logger.listener.js.map