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
exports.VisitStatsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class VisitStatsDto {
    roomId;
    totalVisits;
    uniqueVisitors;
    averageDuration;
    lastVisit;
    dailyVisits;
    peakHour;
}
exports.VisitStatsDto = VisitStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Room identifier",
        example: "room-123",
    }),
    __metadata("design:type", String)
], VisitStatsDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Total number of visits",
        example: 150,
    }),
    __metadata("design:type", Number)
], VisitStatsDto.prototype, "totalVisits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Number of unique visitors",
        example: 75,
    }),
    __metadata("design:type", Number)
], VisitStatsDto.prototype, "uniqueVisitors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Average visit duration in seconds",
        example: 245,
    }),
    __metadata("design:type", Number)
], VisitStatsDto.prototype, "averageDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Most recent visit timestamp",
        example: "2024-01-15T10:30:00Z",
    }),
    __metadata("design:type", Date)
], VisitStatsDto.prototype, "lastVisit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Daily visit counts for the last 7 days",
        example: [12, 15, 8, 22, 18, 25, 20],
    }),
    __metadata("design:type", Array)
], VisitStatsDto.prototype, "dailyVisits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Peak visit hour (0-23)",
        example: 14,
    }),
    __metadata("design:type", Number)
], VisitStatsDto.prototype, "peakHour", void 0);
//# sourceMappingURL=visit-stats.dto.js.map