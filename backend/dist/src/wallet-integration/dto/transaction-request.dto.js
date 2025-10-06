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
exports.TransactionRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class TransactionRequestDto {
    toAddress;
    amount;
    assetCode = 'XLM';
    memo;
}
exports.TransactionRequestDto = TransactionRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recipient Stellar public key',
        example: 'GALPCCZN4YXA3YMJHKLGSHTPHQJ3L3X5D2J4QZJXK7N6VQZ3Y4I5L6M7N8O9P'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^G[0-9A-Z]{55}$/, {
        message: 'Invalid Stellar public key format'
    }),
    __metadata("design:type", String)
], TransactionRequestDto.prototype, "toAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount to send',
        example: 10.5
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.0000001, { message: 'Amount must be greater than 0' }),
    __metadata("design:type", Number)
], TransactionRequestDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Asset code (default: XLM)',
        example: 'XLM',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransactionRequestDto.prototype, "assetCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction memo',
        example: 'Payment for Whisper service',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransactionRequestDto.prototype, "memo", void 0);
//# sourceMappingURL=transaction-request.dto.js.map