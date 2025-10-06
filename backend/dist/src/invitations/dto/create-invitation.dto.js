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
exports.CreateInvitationDto = exports.InvitationDuration = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var InvitationDuration;
(function (InvitationDuration) {
    InvitationDuration["ONE_HOUR"] = "1h";
    InvitationDuration["SIX_HOURS"] = "6h";
    InvitationDuration["ONE_DAY"] = "1d";
    InvitationDuration["THREE_DAYS"] = "3d";
    InvitationDuration["ONE_WEEK"] = "7d";
    InvitationDuration["ONE_MONTH"] = "30d";
    InvitationDuration["CUSTOM"] = "custom";
})(InvitationDuration || (exports.InvitationDuration = InvitationDuration = {}));
class CreateInvitationDto {
    roomId;
    message;
    duration = InvitationDuration.ONE_DAY;
    customExpiry;
    maxUsage = 1;
    metadata;
}
exports.CreateInvitationDto = CreateInvitationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID of the room to invite to" }),
    (0, class_validator_1.IsUUID)(4, { message: "Room ID must be a valid UUID" }),
    __metadata("design:type", String)
], CreateInvitationDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Optional message to include with invitation" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateInvitationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: InvitationDuration,
        description: "Duration before invitation expires",
        default: InvitationDuration.ONE_DAY,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(InvitationDuration),
    __metadata("design:type", String)
], CreateInvitationDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Custom expiry date (required if duration is custom)" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInvitationDto.prototype, "customExpiry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Maximum number of times this invitation can be used",
        minimum: 1,
        maximum: 100,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: "Max usage must be at least 1" }),
    (0, class_validator_1.Max)(100, { message: "Max usage cannot exceed 100" }),
    __metadata("design:type", Number)
], CreateInvitationDto.prototype, "maxUsage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Additional metadata for the invitation" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateInvitationDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-invitation.dto.js.map