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
exports.AlertDropDto = exports.FeatureDrilldownDto = exports.HistoricalTrendDto = exports.DauBreakdownDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DauBreakdownDto {
    date;
    featureName;
    uniqueUsers;
    totalSessions;
    averageSessionDuration;
    newUsers;
    returningUsers;
    benchmarkGoal;
    goalAchievement;
}
exports.DauBreakdownDto = DauBreakdownDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DauBreakdownDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DauBreakdownDto.prototype, "featureName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DauBreakdownDto.prototype, "uniqueUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DauBreakdownDto.prototype, "totalSessions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DauBreakdownDto.prototype, "averageSessionDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DauBreakdownDto.prototype, "newUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DauBreakdownDto.prototype, "returningUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], DauBreakdownDto.prototype, "benchmarkGoal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], DauBreakdownDto.prototype, "goalAchievement", void 0);
class HistoricalTrendDto {
    date;
    totalDau;
    changeFromPrevious;
    changePercentage;
    trend;
}
exports.HistoricalTrendDto = HistoricalTrendDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], HistoricalTrendDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], HistoricalTrendDto.prototype, "totalDau", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], HistoricalTrendDto.prototype, "changeFromPrevious", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], HistoricalTrendDto.prototype, "changePercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], HistoricalTrendDto.prototype, "trend", void 0);
class FeatureDrilldownDto {
    featureName;
    totalUsers;
    totalSessions;
    averageDuration;
    userPercentage;
    sessionPercentage;
}
exports.FeatureDrilldownDto = FeatureDrilldownDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FeatureDrilldownDto.prototype, "featureName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FeatureDrilldownDto.prototype, "totalUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FeatureDrilldownDto.prototype, "totalSessions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FeatureDrilldownDto.prototype, "averageDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FeatureDrilldownDto.prototype, "userPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FeatureDrilldownDto.prototype, "sessionPercentage", void 0);
class AlertDropDto {
    id;
    alertDate;
    featureName;
    alertType;
    severity;
    currentValue;
    expectedValue;
    dropPercentage;
    message;
    isResolved;
}
exports.AlertDropDto = AlertDropDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AlertDropDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AlertDropDto.prototype, "alertDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AlertDropDto.prototype, "featureName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AlertDropDto.prototype, "alertType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AlertDropDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlertDropDto.prototype, "currentValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlertDropDto.prototype, "expectedValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlertDropDto.prototype, "dropPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AlertDropDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], AlertDropDto.prototype, "isResolved", void 0);
//# sourceMappingURL=dau-response.dto.js.map