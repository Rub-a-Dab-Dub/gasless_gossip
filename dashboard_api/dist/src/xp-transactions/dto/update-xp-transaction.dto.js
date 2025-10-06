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
exports.UpdateXPTransactionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateXPTransactionDto {
    amount;
    reason;
    adjustedBy;
}
exports.UpdateXPTransactionDto = UpdateXPTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'XP adjustment (positive or negative)' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateXPTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Correcting duplicate award' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateXPTransactionDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin-uuid' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateXPTransactionDto.prototype, "adjustedBy", void 0);
//# sourceMappingURL=update-xp-transaction.dto.js.map