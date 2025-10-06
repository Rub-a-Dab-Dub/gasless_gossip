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
exports.Listing = void 0;
const typeorm_1 = require("typeorm");
let Listing = class Listing {
    id;
    giftId;
    price;
    sellerId;
    isActive;
    createdAt;
    updatedAt;
};
exports.Listing = Listing;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Listing.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gift_id' }),
    __metadata("design:type", String)
], Listing.prototype, "giftId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 18, scale: 7 }),
    __metadata("design:type", Number)
], Listing.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seller_id' }),
    __metadata("design:type", String)
], Listing.prototype, "sellerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Listing.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Listing.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Listing.prototype, "updatedAt", void 0);
exports.Listing = Listing = __decorate([
    (0, typeorm_1.Entity)('listings')
], Listing);
//# sourceMappingURL=listing.entity.js.map