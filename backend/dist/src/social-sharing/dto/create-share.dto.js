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
exports.ShareResponseDto = exports.CreateShareDto = void 0;
const class_validator_1 = require("class-validator");
const share_entity_1 = require("../entities/share.entity");
class CreateShareDto {
    contentType;
    contentId;
    platform;
    shareText;
    metadata;
}
exports.CreateShareDto = CreateShareDto;
__decorate([
    (0, class_validator_1.IsEnum)(share_entity_1.ContentType),
    __metadata("design:type", String)
], CreateShareDto.prototype, "contentType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateShareDto.prototype, "contentId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(share_entity_1.Platform),
    __metadata("design:type", String)
], CreateShareDto.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShareDto.prototype, "shareText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateShareDto.prototype, "metadata", void 0);
class ShareResponseDto {
    id;
    userId;
    contentType;
    contentId;
    platform;
    shareUrl;
    externalUrl;
    shareText;
    metadata;
    xpAwarded;
    stellarTxId;
    isSuccessful;
    errorMessage;
    createdAt;
    updatedAt;
}
exports.ShareResponseDto = ShareResponseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShareResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShareResponseDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(share_entity_1.ContentType),
    __metadata("design:type", String)
], ShareResponseDto.prototype, "contentType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShareResponseDto.prototype, "contentId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(share_entity_1.Platform),
    __metadata("design:type", String)
], ShareResponseDto.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShareResponseDto.prototype, "shareUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShareResponseDto.prototype, "externalUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShareResponseDto.prototype, "shareText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ShareResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Number)
], ShareResponseDto.prototype, "xpAwarded", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShareResponseDto.prototype, "stellarTxId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ShareResponseDto.prototype, "isSuccessful", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShareResponseDto.prototype, "errorMessage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Date)
], ShareResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Date)
], ShareResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=create-share.dto.js.map