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
exports.TrendForecastResponse = exports.TopUserResponse = exports.ROIComparisonResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class ROIComparisonResponse {
    period1ROI;
    period2ROI;
    difference;
    percentageChange;
}
exports.ROIComparisonResponse = ROIComparisonResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ROIComparisonResponse.prototype, "period1ROI", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ROIComparisonResponse.prototype, "period2ROI", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ROIComparisonResponse.prototype, "difference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ROIComparisonResponse.prototype, "percentageChange", void 0);
class TopUserResponse {
    userId;
    totalVolume;
    transactionCount;
    lastActive;
}
exports.TopUserResponse = TopUserResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TopUserResponse.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TopUserResponse.prototype, "totalVolume", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TopUserResponse.prototype, "transactionCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TopUserResponse.prototype, "lastActive", void 0);
class TrendForecastResponse {
    predictedVolume;
    confidence;
    growthRate;
}
exports.TrendForecastResponse = TrendForecastResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TrendForecastResponse.prototype, "predictedVolume", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TrendForecastResponse.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TrendForecastResponse.prototype, "growthRate", void 0);
//# sourceMappingURL=response.dto.js.map