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
exports.InvitationResponseDto = exports.UserSummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const invitation_entity_1 = require("../entities/invitation.entity");
class UserSummaryDto {
    id;
    username;
    avatar;
}
exports.UserSummaryDto = UserSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserSummaryDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserSummaryDto.prototype, "avatar", void 0);
class InvitationResponseDto {
    id;
    roomId;
    code;
    message;
    status;
    expiresAt;
    acceptedAt;
    usageCount;
    maxUsage;
    remainingUses;
    isExpired;
    isUsable;
    inviter;
    invitee;
    createdAt;
    updatedAt;
    metadata;
    get shareableLink() {
        return `${process.env.FRONTEND_URL || "https://whisper.app"}/join/${this.code}`;
    }
    stellarTxId;
}
exports.InvitationResponseDto = InvitationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InvitationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InvitationResponseDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InvitationResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], InvitationResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: invitation_entity_1.InvitationStatus }),
    __metadata("design:type", String)
], InvitationResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], InvitationResponseDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], InvitationResponseDto.prototype, "acceptedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], InvitationResponseDto.prototype, "usageCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], InvitationResponseDto.prototype, "maxUsage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], InvitationResponseDto.prototype, "remainingUses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], InvitationResponseDto.prototype, "isExpired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], InvitationResponseDto.prototype, "isUsable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserSummaryDto }),
    (0, class_transformer_1.Type)(() => UserSummaryDto),
    __metadata("design:type", UserSummaryDto)
], InvitationResponseDto.prototype, "inviter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UserSummaryDto }),
    (0, class_transformer_1.Type)(() => UserSummaryDto),
    __metadata("design:type", UserSummaryDto)
], InvitationResponseDto.prototype, "invitee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], InvitationResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], InvitationResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], InvitationResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], InvitationResponseDto.prototype, "shareableLink", null);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], InvitationResponseDto.prototype, "stellarTxId", void 0);
//# sourceMappingURL=invitation-response.dto.js.map