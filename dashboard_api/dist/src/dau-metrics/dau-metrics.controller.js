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
exports.DauMetricsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let DauMetricsController = class DauMetricsController {
    dauMetricsService;
    constructor(dauMetricsService) {
        this.dauMetricsService = dauMetricsService;
    }
    async computeDau(createDto) {
        return await this.dauMetricsService.computeDau(createDto);
    }
    async computeDauBulk(createDtos) {
        return await this.dauMetricsService.computeDauBulk(createDtos);
    }
    async computeDauFromUsage(date, timezone) {
        return await this.dauMetricsService.computeDauFromUsage(date, timezone);
    }
    async trackFeatureUsage(trackDto) {
        return await this.dauMetricsService.trackFeatureUsage(trackDto);
    }
    async getDauBreakdown(query) {
        return await this.dauMetricsService.getDauBreakdown(query);
    }
    async getMetrics(query) {
        return await this.dauMetricsService.getMetrics(query);
    }
    async updateMetric(id, updateDto) {
        return await this.dauMetricsService.updateMetric(id, updateDto);
    }
    async getHistoricalTrends(startDate, endDate, timezone) {
        return await this.dauMetricsService.getHistoricalTrends(startDate, endDate, timezone);
    }
    async getFeatureDrilldown(startDate, endDate, timezone) {
        return await this.dauMetricsService.getFeatureDrilldown(startDate, endDate, timezone);
    }
    async getAlerts(isResolved) {
        return await this.dauMetricsService.getAlerts(isResolved);
    }
    async deleteAlert(id) {
        return await this.dauMetricsService.deleteAlert(id);
    }
    async resolveAlert(id) {
        return await this.dauMetricsService.resolveAlert(id);
    }
    async getChartData(startDate, endDate, timezone) {
        return await this.dauMetricsService.getChartData(startDate, endDate, timezone);
    }
};
exports.DauMetricsController = DauMetricsController;
__decorate([
    (0, common_1.Post)("compute"),
    (0, swagger_1.ApiOperation)({ summary: "Compute DAU for a specific date and feature" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "DAU computed successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], DauMetricsController.prototype, "computeDau", null);
__decorate([
    (0, common_1.Post)("compute/bulk"),
    (0, swagger_1.ApiOperation)({ summary: "Compute DAU for multiple dates/features at once" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "DAU metrics computed successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], DauMetricsController.prototype, "computeDauBulk", null);
__decorate([
    (0, common_1.Post)("compute/from-usage"),
    (0, swagger_1.ApiOperation)({ summary: "Compute DAU from raw feature usage data" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "DAU computed from usage data" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DauMetricsController.prototype, "computeDauFromUsage", null);
__decorate([
    (0, common_1.Post)("track"),
    (0, swagger_1.ApiOperation)({ summary: "Track individual feature usage (for real-time DAU)" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Feature usage tracked successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], DauMetricsController.prototype, "trackFeatureUsage", null);
__decorate([
    (0, common_1.Get)("breakdown"),
    (0, swagger_1.ApiOperation)({ summary: "Get DAU breakdown by features" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "DAU breakdown retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], DauMetricsController.prototype, "getDauBreakdown", null);
__decorate([
    (0, common_1.Get)("metrics"),
    (0, swagger_1.ApiOperation)({ summary: "Get DAU metrics with pagination" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Metrics retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], DauMetricsController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Put)("metrics/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a DAU metric" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Metric updated successfully" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Metric ID" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], DauMetricsController.prototype, "updateMetric", null);
__decorate([
    (0, common_1.Get)("trends"),
    (0, swagger_1.ApiOperation)({ summary: "Get historical DAU trends" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Historical trends retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DauMetricsController.prototype, "getHistoricalTrends", null);
__decorate([
    (0, common_1.Get)("drilldown"),
    (0, swagger_1.ApiOperation)({ summary: "Get feature-level drilldown analysis" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Feature drilldown retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DauMetricsController.prototype, "getFeatureDrilldown", null);
__decorate([
    (0, common_1.Get)("alerts"),
    (0, swagger_1.ApiOperation)({ summary: "Get all DAU alerts" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Alerts retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], DauMetricsController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Delete)("alerts/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: "Delete a DAU alert" }),
    (0, swagger_1.ApiResponse)({ status: 204, description: "Alert deleted successfully" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Alert ID" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DauMetricsController.prototype, "deleteAlert", null);
__decorate([
    (0, common_1.Put)("alerts/:id/resolve"),
    (0, swagger_1.ApiOperation)({ summary: "Mark an alert as resolved" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Alert resolved successfully" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Alert ID" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DauMetricsController.prototype, "resolveAlert", null);
__decorate([
    (0, common_1.Get)("chart-data"),
    (0, swagger_1.ApiOperation)({ summary: "Get chart-ready JSON data for visualization" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Chart data retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DauMetricsController.prototype, "getChartData", null);
exports.DauMetricsController = DauMetricsController = __decorate([
    (0, swagger_1.ApiTags)("DAU Metrics"),
    (0, common_1.Controller)("dau-metrics"),
    __metadata("design:paramtypes", [Function])
], DauMetricsController);
//# sourceMappingURL=dau-metrics.controller.js.map