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
exports.MarketplaceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const listing_entity_1 = require("./entities/listing.entity");
const stellar_service_1 = require("../stellar/stellar.service");
let MarketplaceService = class MarketplaceService {
    listingRepository;
    stellarService;
    constructor(listingRepository, stellarService) {
        this.listingRepository = listingRepository;
        this.stellarService = stellarService;
    }
    async createListing(sellerId, createListingDto) {
        const listing = this.listingRepository.create({
            ...createListingDto,
            sellerId,
        });
        return this.listingRepository.save(listing);
    }
    async purchaseListing(buyerId, listingId) {
        const listing = await this.listingRepository.findOne({
            where: { id: listingId, isActive: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found or inactive');
        }
        if (listing.sellerId === buyerId) {
            throw new common_1.BadRequestException('Cannot purchase your own listing');
        }
        await this.transferTokens(buyerId, listing.sellerId, listing.price);
        listing.isActive = false;
        return this.listingRepository.save(listing);
    }
    async findAll() {
        return this.listingRepository.find({ where: { isActive: true } });
    }
    async transferTokens(from, to, amount) {
        console.log(`Transferring ${amount} tokens from ${from} to ${to}`);
    }
};
exports.MarketplaceService = MarketplaceService;
exports.MarketplaceService = MarketplaceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(listing_entity_1.Listing)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stellar_service_1.StellarService])
], MarketplaceService);
//# sourceMappingURL=marketplace.service.js.map