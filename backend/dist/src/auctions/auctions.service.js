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
exports.AuctionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const auction_entity_1 = require("./entities/auction.entity");
const bid_entity_1 = require("./entities/bid.entity");
const stellar_service_1 = require("./stellar.service");
let AuctionsService = class AuctionsService {
    auctionRepository;
    bidRepository;
    stellarService;
    constructor(auctionRepository, bidRepository, stellarService) {
        this.auctionRepository = auctionRepository;
        this.bidRepository = bidRepository;
        this.stellarService = stellarService;
    }
    async startAuction(startAuctionDto) {
        const endTime = new Date(startAuctionDto.endTime);
        if (endTime <= new Date()) {
            throw new common_1.BadRequestException('End time must be in the future');
        }
        const stellarEscrowAccount = await this.stellarService.createEscrowAccount();
        const auction = this.auctionRepository.create({
            giftId: startAuctionDto.giftId,
            endTime,
            highestBid: startAuctionDto.startingBid || 0,
            stellarEscrowAccount,
            status: 'ACTIVE',
        });
        return await this.auctionRepository.save(auction);
    }
    async placeBid(placeBidDto) {
        const auction = await this.auctionRepository.findOne({
            where: { id: placeBidDto.auctionId },
            relations: ['bids'],
        });
        if (!auction) {
            throw new common_1.NotFoundException('Auction not found');
        }
        if (auction.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Auction is not active');
        }
        if (new Date() >= auction.endTime) {
            throw new common_1.BadRequestException('Auction has ended');
        }
        if (placeBidDto.amount <= auction.highestBid) {
            throw new common_1.BadRequestException(`Bid must be higher than current highest bid of ${auction.highestBid}`);
        }
        const stellarTransactionId = await this.stellarService.processEscrowPayment(placeBidDto.bidderId, auction.stellarEscrowAccount, placeBidDto.amount);
        const bid = this.bidRepository.create({
            auctionId: placeBidDto.auctionId,
            bidderId: placeBidDto.bidderId,
            amount: placeBidDto.amount,
            stellarTransactionId,
        });
        await this.bidRepository.save(bid);
        auction.highestBid = placeBidDto.amount;
        await this.auctionRepository.save(auction);
        await this.refundPreviousBidders(auction, placeBidDto.bidderId);
        return bid;
    }
    async getAuctionById(id) {
        const auction = await this.auctionRepository.findOne({
            where: { id },
            relations: ['bids'],
        });
        if (!auction) {
            throw new common_1.NotFoundException('Auction not found');
        }
        return auction;
    }
    async getActiveAuctions() {
        return await this.auctionRepository.find({
            where: {
                status: 'ACTIVE',
                endTime: (0, typeorm_2.MoreThan)(new Date()),
            },
            relations: ['bids'],
            order: { endTime: 'ASC' },
        });
    }
    async refundPreviousBidders(auction, currentBidderId) {
        const previousBids = auction.bids
            .filter((bid) => bid.bidderId !== currentBidderId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        for (const bid of previousBids) {
            await this.stellarService.refundBidder(auction.stellarEscrowAccount, bid.bidderId, bid.amount, bid.stellarTransactionId);
        }
    }
    async resolveExpiredAuctions() {
        const expiredAuctions = await this.auctionRepository.find({
            where: {
                status: 'ACTIVE',
                endTime: (0, typeorm_2.MoreThan)(new Date()),
            },
            relations: ['bids'],
        });
        for (const auction of expiredAuctions) {
            await this.resolveAuction(auction);
        }
    }
    async resolveAuction(auction) {
        if (auction.bids.length === 0) {
            auction.status = 'ENDED';
            await this.auctionRepository.save(auction);
            return;
        }
        const winningBid = auction.bids.sort((a, b) => b.amount - a.amount)[0];
        await this.stellarService.transferToGiftOwner(auction.stellarEscrowAccount, auction.giftId, winningBid.amount);
        auction.status = 'ENDED';
        auction.winnerId = winningBid.bidderId;
        await this.auctionRepository.save(auction);
        await this.stellarService.transferGiftToWinner(auction.giftId, winningBid.bidderId);
    }
};
exports.AuctionsService = AuctionsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuctionsService.prototype, "resolveExpiredAuctions", null);
exports.AuctionsService = AuctionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auction_entity_1.Auction)),
    __param(1, (0, typeorm_1.InjectRepository)(bid_entity_1.Bid)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        stellar_service_1.StellarService])
], AuctionsService);
//# sourceMappingURL=auctions.service.js.map