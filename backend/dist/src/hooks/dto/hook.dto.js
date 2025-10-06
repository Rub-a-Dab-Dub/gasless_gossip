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
exports.HookResponseDto = exports.StellarEventDto = exports.CreateHookDto = void 0;
const class_validator_1 = require("class-validator");
const hook_entity_1 = require("../entities/hook.entity");
class CreateHookDto {
    eventType;
    data;
    stellarTransactionId;
    stellarAccountId;
}
exports.CreateHookDto = CreateHookDto;
__decorate([
    (0, class_validator_1.IsEnum)(hook_entity_1.EventType),
    __metadata("design:type", String)
], CreateHookDto.prototype, "eventType", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateHookDto.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHookDto.prototype, "stellarTransactionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHookDto.prototype, "stellarAccountId", void 0);
class StellarEventDto {
    transactionId;
    accountId;
    eventType;
    eventData;
    contractId;
}
exports.StellarEventDto = StellarEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StellarEventDto.prototype, "transactionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StellarEventDto.prototype, "accountId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(hook_entity_1.EventType),
    __metadata("design:type", String)
], StellarEventDto.prototype, "eventType", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], StellarEventDto.prototype, "eventData", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StellarEventDto.prototype, "contractId", void 0);
class HookResponseDto {
    id;
    eventType;
    data;
    stellarTransactionId;
    stellarAccountId;
    processed;
    createdAt;
    processedAt;
    errorMessage;
}
exports.HookResponseDto = HookResponseDto;
//# sourceMappingURL=hook.dto.js.map