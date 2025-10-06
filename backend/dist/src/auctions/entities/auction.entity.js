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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auction = void 0;
const typeorm_1 = require("typeorm");
const bid_entity_1 = require("./bid.entity");
let Auction = class Auction {
    id;
    giftId;
    highestBid;
    endTime;
    status;
    winnerId;
    stellarEscrowAccount;
    bids;
    createdAt;
    updatedAt;
};
exports.Auction = Auction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Auction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Auction.prototype, "giftId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Auction.prototype, "highestBid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Auction.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ACTIVE' }),
    __metadata("design:type", String)
], Auction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Auction.prototype, "winnerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Auction.prototype, "stellarEscrowAccount", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bid_entity_1.Bid, (bid) => bid.auction),
    __metadata("design:type", Array)
], Auction.prototype, "bids", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Auction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Auction.prototype, "updatedAt", void 0);
exports.Auction = Auction = __decorate([
    (0, typeorm_1.Entity)('auctions')
], Auction);
//# sourceMappingURL=auction.entity.js.map