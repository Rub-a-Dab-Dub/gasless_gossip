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
exports.AcceptInvitationDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class AcceptInvitationDto {
    code;
    stellarTxId;
    userId;
}
exports.AcceptInvitationDto = AcceptInvitationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Invitation code to accept",
        example: "ABC123DEF456",
        minLength: 12,
        maxLength: 12,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(12, 12, { message: "Invitation code must be exactly 12 characters" }),
    (0, class_validator_1.Matches)(/^[A-Z0-9]{12}$/, { message: "Invitation code must contain only uppercase letters and numbers" }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toUpperCase().trim()),
    __metadata("design:type", String)
], AcceptInvitationDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Optional Stellar transaction ID for verification" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AcceptInvitationDto.prototype, "stellarTxId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "User ID accepting the invitation (if different from authenticated user)" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4),
    __metadata("design:type", String)
], AcceptInvitationDto.prototype, "userId", void 0);
//# sourceMappingURL=accept-invitation.dto.js.map