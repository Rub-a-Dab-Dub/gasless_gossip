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
exports.CreateDegenBadgeDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const degen_badge_entity_1 = require("../entities/degen-badge.entity");
class BadgeCriteriaDto {
    minAmount;
    streakLength;
    riskLevel;
    timeframe;
    conditions;
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Minimum amount required" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BadgeCriteriaDto.prototype, "minAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Required streak length" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BadgeCriteriaDto.prototype, "streakLength", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Risk level (1-10)" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BadgeCriteriaDto.prototype, "riskLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Timeframe for criteria" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BadgeCriteriaDto.prototype, "timeframe", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Additional conditions" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BadgeCriteriaDto.prototype, "conditions", void 0);
class CreateDegenBadgeDto {
    userId;
    badgeType;
    rarity;
    criteria;
    description;
    imageUrl;
    rewardAmount;
    mintStellarToken;
}
exports.CreateDegenBadgeDto = CreateDegenBadgeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User ID to award badge to" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDegenBadgeDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: degen_badge_entity_1.DegenBadgeType, description: "Type of degen badge" }),
    (0, class_validator_1.IsEnum)(degen_badge_entity_1.DegenBadgeType),
    __metadata("design:type", String)
], CreateDegenBadgeDto.prototype, "badgeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: degen_badge_entity_1.DegenBadgeRarity, required: false, description: "Badge rarity" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(degen_badge_entity_1.DegenBadgeRarity),
    __metadata("design:type", String)
], CreateDegenBadgeDto.prototype, "rarity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BadgeCriteriaDto, description: "Badge criteria" }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BadgeCriteriaDto),
    __metadata("design:type", BadgeCriteriaDto)
], CreateDegenBadgeDto.prototype, "criteria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Badge description" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDegenBadgeDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Badge image URL" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDegenBadgeDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Reward amount in tokens" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDegenBadgeDto.prototype, "rewardAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Whether to mint Stellar token" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDegenBadgeDto.prototype, "mintStellarToken", void 0);
//# sourceMappingURL=create-degen-badge.dto.js.map