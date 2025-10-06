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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryXPTransactionDto = void 0;
class QueryXPTransactionDto {
    page = 1;
    limit = 50;
    userId;
    actionType;
    startDate;
    endDate;
    minAmount;
    transactionId;
    status;
}
exports.QueryXPTransactionDto = QueryXPTransactionDto;
__decorate([
    ApiProperty({ required: false, example: 1 }),
    IsOptional(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], QueryXPTransactionDto.prototype, "page", void 0);
__decorate([
    ApiProperty({ required: false, example: 50 }),
    IsOptional(),
    IsInt(),
    Min(1),
    Max(100),
    __metadata("design:type", Number)
], QueryXPTransactionDto.prototype, "limit", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], QueryXPTransactionDto.prototype, "userId", void 0);
__decorate([
    ApiProperty({ enum: ActionType, required: false }),
    IsOptional(),
    IsEnum(ActionType),
    __metadata("design:type", typeof (_a = typeof ActionType !== "undefined" && ActionType) === "function" ? _a : Object)
], QueryXPTransactionDto.prototype, "actionType", void 0);
__decorate([
    ApiProperty({ required: false, example: '2025-01-01' }),
    IsOptional(),
    __metadata("design:type", String)
], QueryXPTransactionDto.prototype, "startDate", void 0);
__decorate([
    ApiProperty({ required: false, example: '2025-12-31' }),
    IsOptional(),
    __metadata("design:type", String)
], QueryXPTransactionDto.prototype, "endDate", void 0);
__decorate([
    ApiProperty({ required: false, example: 100, description: 'Minimum XP amount' }),
    IsOptional(),
    IsInt(),
    __metadata("design:type", Number)
], QueryXPTransactionDto.prototype, "minAmount", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], QueryXPTransactionDto.prototype, "transactionId", void 0);
__decorate([
    ApiProperty({ required: false, enum: ['active', 'voided'], example: 'active' }),
    IsOptional(),
    __metadata("design:type", String)
], QueryXPTransactionDto.prototype, "status", void 0);
//# sourceMappingURL=query-xp-transaction.dto.js.map