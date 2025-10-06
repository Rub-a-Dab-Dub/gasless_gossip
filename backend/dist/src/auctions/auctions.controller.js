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
exports.AuctionsController = void 0;
const common_1 = require("@nestjs/common");
const auctions_service_1 = require("./auctions.service");
const start_auction_dto_1 = require("./dto/start-auction.dto");
const place_bid_dto_1 = require("./dto/place-bid.dto");
let AuctionsController = class AuctionsController {
    auctionsService;
    constructor(auctionsService) {
        this.auctionsService = auctionsService;
    }
    async startAuction(startAuctionDto) {
        try {
            const auction = await this.auctionsService.startAuction(startAuctionDto);
            return {
                success: true,
                data: auction,
                message: 'Auction started successfully',
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'An error occurred',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async placeBid(placeBidDto) {
        try {
            const bid = await this.auctionsService.placeBid(placeBidDto);
            return {
                success: true,
                data: bid,
                message: 'Bid placed successfully',
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'An error occurred',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAuctionStatus(id) {
        try {
            const auction = await this.auctionsService.getAuctionById(id);
            return {
                success: true,
                data: auction,
                message: 'Auction retrieved successfully',
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'An error occurred',
            }, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getActiveAuctions() {
        try {
            const auctions = await this.auctionsService.getActiveAuctions();
            return {
                success: true,
                data: auctions,
                message: 'Active auctions retrieved successfully',
            };
        }
        catch (error) {
            throw new common_1.HttpException({ success: false, message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuctionsController = AuctionsController;
__decorate([
    (0, common_1.Post)('start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [start_auction_dto_1.StartAuctionDto]),
    __metadata("design:returntype", Promise)
], AuctionsController.prototype, "startAuction", null);
__decorate([
    (0, common_1.Post)('bid'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [place_bid_dto_1.PlaceBidDto]),
    __metadata("design:returntype", Promise)
], AuctionsController.prototype, "placeBid", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuctionsController.prototype, "getAuctionStatus", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuctionsController.prototype, "getActiveAuctions", null);
exports.AuctionsController = AuctionsController = __decorate([
    (0, common_1.Controller)('auctions'),
    __metadata("design:paramtypes", [auctions_service_1.AuctionsService])
], AuctionsController);
//# sourceMappingURL=auctions.controller.js.map