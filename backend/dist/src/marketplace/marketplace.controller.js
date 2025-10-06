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
exports.MarketplaceController = void 0;
const common_1 = require("@nestjs/common");
const marketplace_service_1 = require("./marketplace.service");
const create_listing_dto_1 = require("./dto/create-listing.dto");
const purchase_listing_dto_1 = require("./dto/purchase-listing.dto");
const auth_guard_1 = require("../auth/auth.guard");
let MarketplaceController = class MarketplaceController {
    marketplaceService;
    constructor(marketplaceService) {
        this.marketplaceService = marketplaceService;
    }
    createListing(req, createListingDto) {
        return this.marketplaceService.createListing(req.user.sub, createListingDto);
    }
    purchaseListing(req, purchaseListingDto) {
        return this.marketplaceService.purchaseListing(req.user.sub, purchaseListingDto.listingId);
    }
    findAll() {
        return this.marketplaceService.findAll();
    }
};
exports.MarketplaceController = MarketplaceController;
__decorate([
    (0, common_1.Post)('list'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_listing_dto_1.CreateListingDto]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "createListing", null);
__decorate([
    (0, common_1.Post)('buy'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, purchase_listing_dto_1.PurchaseListingDto]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "purchaseListing", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "findAll", null);
exports.MarketplaceController = MarketplaceController = __decorate([
    (0, common_1.Controller)('marketplace'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [marketplace_service_1.MarketplaceService])
], MarketplaceController);
//# sourceMappingURL=marketplace.controller.js.map