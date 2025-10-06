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
exports.BatchAwardBadgeDto = exports.AwardBadgeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const degen_badge_entity_1 = require("../entities/degen-badge.entity");
class AwardBadgeDto {
    userId;
    badgeType;
    achievementData;
    mintToken;
    customRewardAmount;
}
exports.AwardBadgeDto = AwardBadgeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User ID to award badge to" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AwardBadgeDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: degen_badge_entity_1.DegenBadgeType, description: "Type of degen badge to award" }),
    (0, class_validator_1.IsEnum)(degen_badge_entity_1.DegenBadgeType),
    __metadata("design:type", String)
], AwardBadgeDto.prototype, "badgeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Achievement data that triggered the badge" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AwardBadgeDto.prototype, "achievementData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Whether to mint Stellar token immediately" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AwardBadgeDto.prototype, "mintToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Custom reward amount override" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AwardBadgeDto.prototype, "customRewardAmount", void 0);
class BatchAwardBadgeDto {
    userIds;
    badgeType;
    mintTokens;
}
exports.BatchAwardBadgeDto = BatchAwardBadgeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User IDs to award badges to" }),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    __metadata("design:type", Array)
], BatchAwardBadgeDto.prototype, "userIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: degen_badge_entity_1.DegenBadgeType, description: "Type of degen badge to award" }),
    (0, class_validator_1.IsEnum)(degen_badge_entity_1.DegenBadgeType),
    __metadata("design:type", String)
], BatchAwardBadgeDto.prototype, "badgeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Whether to mint Stellar tokens" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BatchAwardBadgeDto.prototype, "mintTokens", void 0);
//# sourceMappingURL=award-badge.dto.js.map