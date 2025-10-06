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
exports.CreateVisitDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateVisitDto {
    roomId;
    userId;
    ipAddress;
    userAgent;
    referrer;
    duration;
}
exports.CreateVisitDto = CreateVisitDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Room identifier",
        example: "room-123",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User identifier",
        example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "IP address of the visitor",
        example: "192.168.1.1",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIP)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "User agent string",
        example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Referrer URL",
        example: "https://example.com/previous-page",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "referrer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Visit duration in seconds",
        example: 300,
        minimum: 1,
        maximum: 86400,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(86400),
    __metadata("design:type", Number)
], CreateVisitDto.prototype, "duration", void 0);
//# sourceMappingURL=create-visit.dto.js.map