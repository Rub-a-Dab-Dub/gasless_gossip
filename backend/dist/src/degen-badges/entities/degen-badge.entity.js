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
exports.DegenBadge = exports.DegenBadgeRarity = exports.DegenBadgeType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var DegenBadgeType;
(function (DegenBadgeType) {
    DegenBadgeType["HIGH_ROLLER"] = "high_roller";
    DegenBadgeType["RISK_TAKER"] = "risk_taker";
    DegenBadgeType["STREAK_MASTER"] = "streak_master";
    DegenBadgeType["WHALE_HUNTER"] = "whale_hunter";
    DegenBadgeType["DIAMOND_HANDS"] = "diamond_hands";
    DegenBadgeType["DEGEN_LEGEND"] = "degen_legend";
})(DegenBadgeType || (exports.DegenBadgeType = DegenBadgeType = {}));
var DegenBadgeRarity;
(function (DegenBadgeRarity) {
    DegenBadgeRarity["COMMON"] = "common";
    DegenBadgeRarity["RARE"] = "rare";
    DegenBadgeRarity["EPIC"] = "epic";
    DegenBadgeRarity["LEGENDARY"] = "legendary";
})(DegenBadgeRarity || (exports.DegenBadgeRarity = DegenBadgeRarity = {}));
let DegenBadge = class DegenBadge {
    id;
    userId;
    user;
    badgeType;
    rarity;
    criteria;
    txId;
    stellarAssetCode;
    stellarAssetIssuer;
    description;
    imageUrl;
    rewardAmount;
    isActive;
    createdAt;
    updatedAt;
};
exports.DegenBadge = DegenBadge;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], DegenBadge.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid"),
    __metadata("design:type", String)
], DegenBadge.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", user_entity_1.User)
], DegenBadge.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: DegenBadgeType,
    }),
    __metadata("design:type", String)
], DegenBadge.prototype, "badgeType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: DegenBadgeRarity,
        default: DegenBadgeRarity.COMMON,
    }),
    __metadata("design:type", String)
], DegenBadge.prototype, "rarity", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb"),
    __metadata("design:type", Object)
], DegenBadge.prototype, "criteria", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DegenBadge.prototype, "txId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DegenBadge.prototype, "stellarAssetCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DegenBadge.prototype, "stellarAssetIssuer", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", String)
], DegenBadge.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", String)
], DegenBadge.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 18, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], DegenBadge.prototype, "rewardAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], DegenBadge.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DegenBadge.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DegenBadge.prototype, "updatedAt", void 0);
exports.DegenBadge = DegenBadge = __decorate([
    (0, typeorm_1.Entity)("degen_badges")
], DegenBadge);
//# sourceMappingURL=degen-badge.entity.js.map