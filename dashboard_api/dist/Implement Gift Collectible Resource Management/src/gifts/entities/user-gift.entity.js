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
exports.UserGift = void 0;
const typeorm_1 = require("typeorm");
const gift_entity_1 = require("./gift.entity");
let UserGift = class UserGift {
    id;
    userId;
    giftId;
    gift;
    quantity;
    isEquipped;
    acquiredFrom;
    giftedByUserId;
    battleId;
    acquiredAt;
};
exports.UserGift = UserGift;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserGift.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], UserGift.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], UserGift.prototype, "giftId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => gift_entity_1.Gift, (gift) => gift.userGifts, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "giftId" }),
    __metadata("design:type", gift_entity_1.Gift)
], UserGift.prototype, "gift", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 1 }),
    __metadata("design:type", Number)
], UserGift.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserGift.prototype, "isEquipped", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], UserGift.prototype, "acquiredFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], UserGift.prototype, "giftedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], UserGift.prototype, "battleId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserGift.prototype, "acquiredAt", void 0);
exports.UserGift = UserGift = __decorate([
    (0, typeorm_1.Entity)("user_gifts"),
    (0, typeorm_1.Index)(["userId", "giftId"]),
    (0, typeorm_1.Index)(["userId", "acquiredAt"])
], UserGift);
//# sourceMappingURL=user-gift.entity.js.map