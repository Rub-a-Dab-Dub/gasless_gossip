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
exports.PlateauPredictionDto = exports.CohortAnalysisDto = exports.DropOffAnalysisDto = exports.UnlockRatesDto = exports.AverageLevelsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AverageLevelsDto {
    date;
    averageLevel;
    totalUsers;
    cohortId;
}
exports.AverageLevelsDto = AverageLevelsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Date" }),
    __metadata("design:type", String)
], AverageLevelsDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Average level" }),
    __metadata("design:type", Number)
], AverageLevelsDto.prototype, "averageLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Total users" }),
    __metadata("design:type", Number)
], AverageLevelsDto.prototype, "totalUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Cohort ID (if filtered)" }),
    __metadata("design:type", String)
], AverageLevelsDto.prototype, "cohortId", void 0);
class UnlockRatesDto {
    date;
    totalUnlocks;
    uniqueUsers;
    unlockRate;
    cohortId;
}
exports.UnlockRatesDto = UnlockRatesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Date" }),
    __metadata("design:type", String)
], UnlockRatesDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Total unlocks" }),
    __metadata("design:type", Number)
], UnlockRatesDto.prototype, "totalUnlocks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Unique users" }),
    __metadata("design:type", Number)
], UnlockRatesDto.prototype, "uniqueUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Unlock rate (unlocks per user)" }),
    __metadata("design:type", Number)
], UnlockRatesDto.prototype, "unlockRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Cohort ID (if filtered)" }),
    __metadata("design:type", String)
], UnlockRatesDto.prototype, "cohortId", void 0);
class DropOffAnalysisDto {
    level;
    dropOffCount;
    dropOffPercentage;
}
exports.DropOffAnalysisDto = DropOffAnalysisDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Level" }),
    __metadata("design:type", Number)
], DropOffAnalysisDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Drop-off count" }),
    __metadata("design:type", Number)
], DropOffAnalysisDto.prototype, "dropOffCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Drop-off percentage" }),
    __metadata("design:type", Number)
], DropOffAnalysisDto.prototype, "dropOffPercentage", void 0);
class CohortAnalysisDto {
    cohortId;
    cohortName;
    totalUsers;
    averageLevel;
    totalUnlocks;
    retentionRate;
}
exports.CohortAnalysisDto = CohortAnalysisDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Cohort ID" }),
    __metadata("design:type", String)
], CohortAnalysisDto.prototype, "cohortId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Cohort name" }),
    __metadata("design:type", String)
], CohortAnalysisDto.prototype, "cohortName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Total users" }),
    __metadata("design:type", Number)
], CohortAnalysisDto.prototype, "totalUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Average level" }),
    __metadata("design:type", Number)
], CohortAnalysisDto.prototype, "averageLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Total unlocks" }),
    __metadata("design:type", Number)
], CohortAnalysisDto.prototype, "totalUnlocks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Retention rate" }),
    __metadata("design:type", Number)
], CohortAnalysisDto.prototype, "retentionRate", void 0);
class PlateauPredictionDto {
    plateauLevel;
    confidence;
    daysToPlateauEstimate;
    trend;
}
exports.PlateauPredictionDto = PlateauPredictionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Predicted plateau level" }),
    __metadata("design:type", Number)
], PlateauPredictionDto.prototype, "plateauLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Confidence score (0-1)" }),
    __metadata("design:type", Number)
], PlateauPredictionDto.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Days to plateau" }),
    __metadata("design:type", Number)
], PlateauPredictionDto.prototype, "daysToPlateauEstimate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Current trend" }),
    __metadata("design:type", String)
], PlateauPredictionDto.prototype, "trend", void 0);
//# sourceMappingURL=analytics-response.dto.js.map