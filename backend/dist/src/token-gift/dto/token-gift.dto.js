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
exports.PaymasterStatusDto = exports.GasEstimateDto = exports.TokenGiftResponseDto = exports.TokenGiftTransactionDto = exports.TokenGiftDto = exports.CreateTokenGiftDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateTokenGiftDto {
    recipientId;
    tokenAddress;
    tokenSymbol;
    amount;
    network;
    message;
    metadata;
}
exports.CreateTokenGiftDto = CreateTokenGiftDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTokenGiftDto.prototype, "recipientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateTokenGiftDto.prototype, "tokenAddress", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], CreateTokenGiftDto.prototype, "tokenSymbol", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value.toString()),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '0,8' }),
    __metadata("design:type", String)
], CreateTokenGiftDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['stellar', 'base', 'ethereum']),
    __metadata("design:type", String)
], CreateTokenGiftDto.prototype, "network", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 500),
    __metadata("design:type", String)
], CreateTokenGiftDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateTokenGiftDto.prototype, "metadata", void 0);
class TokenGiftDto {
    id;
    senderId;
    recipientId;
    tokenAddress;
    tokenSymbol;
    amount;
    network;
    status;
    stellarTxHash;
    baseTxHash;
    paymasterTxHash;
    gasUsed;
    gasPrice;
    totalCost;
    message;
    metadata;
    sorobanData;
    paymasterData;
    processedAt;
    completedAt;
    createdAt;
    updatedAt;
}
exports.TokenGiftDto = TokenGiftDto;
class TokenGiftTransactionDto {
    id;
    giftId;
    network;
    txHash;
    status;
    blockNumber;
    confirmations;
    gasUsed;
    gasPrice;
    effectiveGasPrice;
    transactionFee;
    sponsored;
    paymasterAddress;
    transactionData;
    receipt;
    errorMessage;
    createdAt;
}
exports.TokenGiftTransactionDto = TokenGiftTransactionDto;
class TokenGiftResponseDto {
    gift;
    transactions;
    estimatedGas;
    paymasterStatus;
}
exports.TokenGiftResponseDto = TokenGiftResponseDto;
class GasEstimateDto {
    network;
    gasUsed;
    gasPrice;
    totalCost;
    sponsored;
    paymasterCoverage;
}
exports.GasEstimateDto = GasEstimateDto;
class PaymasterStatusDto {
    available;
    sponsored;
    maxGas;
    remainingBalance;
    network;
}
exports.PaymasterStatusDto = PaymasterStatusDto;
//# sourceMappingURL=token-gift.dto.js.map