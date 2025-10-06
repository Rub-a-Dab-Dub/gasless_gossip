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
exports.CreateGrowthMetricDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CreateGrowthMetricDto {
    userId;
    cohortId;
    metricDate;
    userLevel;
    unlocksCount;
    dropOffPoint;
    sessionDuration;
    isActive;
}
exports.CreateGrowthMetricDto = CreateGrowthMetricDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User ID", example: "123e4567-e89b-12d3-a456-426614174000" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateGrowthMetricDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Cohort ID", example: "cohort-2025-01" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGrowthMetricDto.prototype, "cohortId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Metric date", example: "2025-10-06" }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateGrowthMetricDto.prototype, "metricDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User level", example: 5, minimum: 0 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateGrowthMetricDto.prototype, "userLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Number of unlocks", example: 3, minimum: 0 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateGrowthMetricDto.prototype, "unlocksCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Drop-off point level", example: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateGrowthMetricDto.prototype, "dropOffPoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Session duration in seconds", example: 3600 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateGrowthMetricDto.prototype, "sessionDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Is user active", example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateGrowthMetricDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-growth-metric.dto.js.map