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
exports.TrackFeatureUsageDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class TrackFeatureUsageDto {
    userId;
    featureName;
    timezone;
    sessionId;
    durationSeconds;
    isNewUser;
    metadata;
}
exports.TrackFeatureUsageDto = TrackFeatureUsageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User ID", example: "123e4567-e89b-12d3-a456-426614174000" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TrackFeatureUsageDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Feature name", example: "chat" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackFeatureUsageDto.prototype, "featureName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Timezone", example: "America/New_York", default: "UTC" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackFeatureUsageDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Session ID", example: "sess_abc123" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackFeatureUsageDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Duration in seconds", example: 120 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TrackFeatureUsageDto.prototype, "durationSeconds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Is this a new user?", example: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], TrackFeatureUsageDto.prototype, "isNewUser", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Additional metadata", example: { action: "send_message" } }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], TrackFeatureUsageDto.prototype, "metadata", void 0);
//# sourceMappingURL=track-feature-usage.dto.js.map