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
exports.ReferralResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const referral_entity_1 = require("../entities/referral.entity");
class ReferralResponseDto {
    id;
    referrerId;
    refereeId;
    reward;
    referralCode;
    status;
    createdAt;
    completedAt;
    stellarTransactionId;
}
exports.ReferralResponseDto = ReferralResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReferralResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReferralResponseDto.prototype, "referrerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReferralResponseDto.prototype, "refereeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReferralResponseDto.prototype, "reward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReferralResponseDto.prototype, "referralCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: referral_entity_1.ReferralStatus }),
    __metadata("design:type", String)
], ReferralResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ReferralResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], ReferralResponseDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ReferralResponseDto.prototype, "stellarTransactionId", void 0);
//# sourceMappingURL=referral-response.dto.js.map