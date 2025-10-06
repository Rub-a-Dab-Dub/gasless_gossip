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
exports.GasEstimateDto = exports.RateLimitStatusDto = exports.PaymasterStatusDto = exports.UserOpResponseDto = exports.UserOpRequestDto = exports.SponsorUserOpDto = exports.SubmitIntentDto = exports.SendChatMessageDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SendChatMessageDto {
    message;
    roomId;
    privateKey;
}
exports.SendChatMessageDto = SendChatMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Chat message content' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendChatMessageDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Room ID where the message is sent' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendChatMessageDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Private key for the smart account' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendChatMessageDto.prototype, "privateKey", void 0);
class SubmitIntentDto {
    intentData;
    intentType;
    privateKey;
}
exports.SubmitIntentDto = SubmitIntentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Intent data payload' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitIntentDto.prototype, "intentData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of intent being submitted' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitIntentDto.prototype, "intentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Private key for the smart account' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitIntentDto.prototype, "privateKey", void 0);
class SponsorUserOpDto {
    to;
    data;
    value;
    gasLimit;
    privateKey;
}
exports.SponsorUserOpDto = SponsorUserOpDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target contract address' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SponsorUserOpDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Encoded function call data' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SponsorUserOpDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ETH value to send (in wei)', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SponsorUserOpDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gas limit for the transaction', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SponsorUserOpDto.prototype, "gasLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Private key for the smart account' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SponsorUserOpDto.prototype, "privateKey", void 0);
class UserOpRequestDto {
    to;
    data;
    value;
    gasLimit;
}
exports.UserOpRequestDto = UserOpRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target contract address' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UserOpRequestDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Encoded function call data' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UserOpRequestDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ETH value to send (in wei)', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserOpRequestDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gas limit for the transaction', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserOpRequestDto.prototype, "gasLimit", void 0);
class UserOpResponseDto {
    success;
    userOpHash;
    txHash;
    error;
    gasUsed;
    gasPrice;
}
exports.UserOpResponseDto = UserOpResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the operation was successful' }),
    __metadata("design:type", Boolean)
], UserOpResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'UserOperation hash', required: false }),
    __metadata("design:type", String)
], UserOpResponseDto.prototype, "userOpHash", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction hash', required: false }),
    __metadata("design:type", String)
], UserOpResponseDto.prototype, "txHash", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Error message if operation failed', required: false }),
    __metadata("design:type", String)
], UserOpResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gas used for the transaction', required: false }),
    __metadata("design:type", String)
], UserOpResponseDto.prototype, "gasUsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gas price for the transaction', required: false }),
    __metadata("design:type", String)
], UserOpResponseDto.prototype, "gasPrice", void 0);
class PaymasterStatusDto {
    isActive;
    balance;
    network;
    chainId;
    lastChecked;
}
exports.PaymasterStatusDto = PaymasterStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether paymaster is active' }),
    __metadata("design:type", Boolean)
], PaymasterStatusDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Paymaster balance in ETH' }),
    __metadata("design:type", String)
], PaymasterStatusDto.prototype, "balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Network name' }),
    __metadata("design:type", String)
], PaymasterStatusDto.prototype, "network", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Chain ID' }),
    __metadata("design:type", Number)
], PaymasterStatusDto.prototype, "chainId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last status check timestamp' }),
    __metadata("design:type", Date)
], PaymasterStatusDto.prototype, "lastChecked", void 0);
class RateLimitStatusDto {
    remaining;
    resetTime;
    limit;
}
exports.RateLimitStatusDto = RateLimitStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Remaining operations in current window' }),
    __metadata("design:type", Number)
], RateLimitStatusDto.prototype, "remaining", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reset time for rate limit window' }),
    __metadata("design:type", Number)
], RateLimitStatusDto.prototype, "resetTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum operations per minute' }),
    __metadata("design:type", Number)
], RateLimitStatusDto.prototype, "limit", void 0);
class GasEstimateDto {
    callGasLimit;
    verificationGasLimit;
    preVerificationGas;
}
exports.GasEstimateDto = GasEstimateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estimated call gas limit' }),
    __metadata("design:type", String)
], GasEstimateDto.prototype, "callGasLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estimated verification gas limit' }),
    __metadata("design:type", String)
], GasEstimateDto.prototype, "verificationGasLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estimated pre-verification gas' }),
    __metadata("design:type", String)
], GasEstimateDto.prototype, "preVerificationGas", void 0);
//# sourceMappingURL=paymaster.dto.js.map