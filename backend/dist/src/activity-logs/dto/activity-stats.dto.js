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
exports.ActivityStatsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ActivityStatsDto {
    totalActivities;
    actionCounts;
    last24Hours;
    last7Days;
    last30Days;
    mostActiveDay;
    averagePerDay;
    mostCommonAction;
}
exports.ActivityStatsDto = ActivityStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Total number of activities" }),
    __metadata("design:type", Number)
], ActivityStatsDto.prototype, "totalActivities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Activities by action type" }),
    __metadata("design:type", Object)
], ActivityStatsDto.prototype, "actionCounts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Activities in the last 24 hours" }),
    __metadata("design:type", Number)
], ActivityStatsDto.prototype, "last24Hours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Activities in the last 7 days" }),
    __metadata("design:type", Number)
], ActivityStatsDto.prototype, "last7Days", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Activities in the last 30 days" }),
    __metadata("design:type", Number)
], ActivityStatsDto.prototype, "last30Days", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Most active day" }),
    __metadata("design:type", Object)
], ActivityStatsDto.prototype, "mostActiveDay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Average activities per day" }),
    __metadata("design:type", Number)
], ActivityStatsDto.prototype, "averagePerDay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Most common action" }),
    __metadata("design:type", Object)
], ActivityStatsDto.prototype, "mostCommonAction", void 0);
//# sourceMappingURL=activity-stats.dto.js.map