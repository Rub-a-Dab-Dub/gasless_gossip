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
exports.DegenBadgeStatsDto = exports.DegenBadgeResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const degen_badge_entity_1 = require("../entities/degen-badge.entity");
class DegenBadgeResponseDto {
    id;
    userId;
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
}
exports.DegenBadgeResponseDto = DegenBadgeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Badge ID" }),
    __metadata("design:type", String)
], DegenBadgeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User ID" }),
    __metadata("design:type", String)
], DegenBadgeResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: degen_badge_entity_1.DegenBadgeType, description: "Badge type" }),
    __metadata("design:type", String)
], DegenBadgeResponseDto.prototype, "badgeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: degen_badge_entity_1.DegenBadgeRarity, description: "Badge rarity" }),
    __metadata("design:type", String)
], DegenBadgeResponseDto.prototype, "rarity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Badge criteria" }),
    __metadata("design:type", Object)
], DegenBadgeResponseDto.prototype, "criteria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Stellar transaction ID" }),
    __metadata("design:type", String)
], DegenBadgeResponseDto.prototype, "txId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Stellar asset code" }),
    __metadata("design:type", String)
], DegenBadgeResponseDto.prototype, "stellarAssetCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Stellar asset issuer" }),
    __metadata("design:type", String)
], DegenBadgeResponseDto.prototype, "stellarAssetIssuer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Badge description" }),
    __metadata("design:type", String)
], DegenBadgeResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Badge image URL" }),
    __metadata("design:type", String)
], DegenBadgeResponseDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Reward amount" }),
    __metadata("design:type", Number)
], DegenBadgeResponseDto.prototype, "rewardAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Whether badge is active" }),
    __metadata("design:type", Boolean)
], DegenBadgeResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Creation date" }),
    __metadata("design:type", Date)
], DegenBadgeResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Last update date" }),
    __metadata("design:type", Date)
], DegenBadgeResponseDto.prototype, "updatedAt", void 0);
class DegenBadgeStatsDto {
    totalBadges;
    badgesByType;
    badgesByRarity;
    totalRewards;
    latestBadge;
    rarestBadge;
}
exports.DegenBadgeStatsDto = DegenBadgeStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Total badges earned" }),
    __metadata("design:type", Number)
], DegenBadgeStatsDto.prototype, "totalBadges", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Badges by type" }),
    __metadata("design:type", Object)
], DegenBadgeStatsDto.prototype, "badgesByType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Badges by rarity" }),
    __metadata("design:type", Object)
], DegenBadgeStatsDto.prototype, "badgesByRarity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Total reward amount earned" }),
    __metadata("design:type", Number)
], DegenBadgeStatsDto.prototype, "totalRewards", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Most recent badge" }),
    __metadata("design:type", DegenBadgeResponseDto)
], DegenBadgeStatsDto.prototype, "latestBadge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Rarest badge owned" }),
    __metadata("design:type", DegenBadgeResponseDto)
], DegenBadgeStatsDto.prototype, "rarestBadge", void 0);
//# sourceMappingURL=degen-badge-response.dto.js.map