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
exports.CreateXPTransactionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const xp_transaction_entity_1 = require("../entities/xp-transaction.entity");
class CreateXPTransactionDto {
    userId;
    actionType;
    amount;
    multiplier;
    reason;
    transactionId;
    metadata;
}
exports.CreateXPTransactionDto = CreateXPTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateXPTransactionDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: xp_transaction_entity_1.ActionType, example: xp_transaction_entity_1.ActionType.MANUAL_AWARD }),
    (0, class_validator_1.IsEnum)(xp_transaction_entity_1.ActionType),
    __metadata("design:type", String)
], CreateXPTransactionDto.prototype, "actionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Base XP amount' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateXPTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1.5, description: 'Multiplier (1.0-10.0)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.1),
    (0, class_validator_1.Max)(10.0),
    __metadata("design:type", Number)
], CreateXPTransactionDto.prototype, "multiplier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Community event participation', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateXPTransactionDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'tx_abc123', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateXPTransactionDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateXPTransactionDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-xp-transaction.dto.js.map