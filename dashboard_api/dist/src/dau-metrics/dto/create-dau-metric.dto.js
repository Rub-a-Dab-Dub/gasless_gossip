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
exports.CreateDauMetricDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateDauMetricDto {
    metricDate;
    timezone;
    featureName;
    uniqueUsers;
    totalSessions;
    totalDurationSeconds;
    newUsers;
    returningUsers;
    benchmarkGoal;
    metadata;
}
exports.CreateDauMetricDto = CreateDauMetricDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Date of the metric (YYYY-MM-DD)", example: "2025-10-06" }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDauMetricDto.prototype, "metricDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Timezone for the metric", example: "America/New_York", default: "UTC" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDauMetricDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Feature name", example: "chat" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDauMetricDto.prototype, "featureName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Number of unique users", example: 150 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDauMetricDto.prototype, "uniqueUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Total number of sessions", example: 320 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDauMetricDto.prototype, "totalSessions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Total duration in seconds", example: 45600 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDauMetricDto.prototype, "totalDurationSeconds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Number of new users", example: 25 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDauMetricDto.prototype, "newUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Number of returning users", example: 125 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDauMetricDto.prototype, "returningUsers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Benchmark goal for this feature", example: 200 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDauMetricDto.prototype, "benchmarkGoal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Additional metadata", example: { platform: "web" } }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDauMetricDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-dau-metric.dto.js.map