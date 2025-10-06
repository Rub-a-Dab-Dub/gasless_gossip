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
exports.CreateFanGiftDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateFanGiftDto {
    giftId;
    creatorId;
    giftType;
    amount;
    stellarAsset = 'XLM';
    message;
}
exports.CreateFanGiftDto = CreateFanGiftDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the gift type' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateFanGiftDto.prototype, "giftId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creator receiving the gift' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateFanGiftDto.prototype, "creatorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of gift being sent' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateFanGiftDto.prototype, "giftType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Amount to gift', minimum: 0.0000001 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 7 }),
    (0, class_validator_1.Min)(0.0000001),
    __metadata("design:type", Number)
], CreateFanGiftDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Stellar asset code', default: 'XLM' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(56),
    __metadata("design:type", String)
], CreateFanGiftDto.prototype, "stellarAsset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Optional message with the gift', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateFanGiftDto.prototype, "message", void 0);
//# sourceMappingURL=create-fan-gift.dto.js.map