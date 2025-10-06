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
exports.GrowthAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let GrowthAnalyticsController = class GrowthAnalyticsController {
    growthAnalyticsService;
    constructor(growthAnalyticsService) {
        this.growthAnalyticsService = growthAnalyticsService;
    }
    async createMetric(createDto) {
        return await this.growthAnalyticsService.createMetric(createDto);
    }
    async createMetricsBulk(createDtos) {
        return await this.growthAnalyticsService.createMetricsBulk(createDtos);
    }
    async getMetrics(query) {
        return await this.growthAnalyticsService.getMetrics(query);
    }
    async getAverageLevels(startDate, endDate, cohortId) {
        return await this.growthAnalyticsService.getAverageLevels(startDate, endDate, cohortId);
    }
    async getUnlockRates(startDate, endDate, cohortId) {
        return await this.growthAnalyticsService.getUnlockRates(startDate, endDate, cohortId);
    }
    async updateMetric(id, updateDto) {
        return await this.growthAnalyticsService.updateMetric(id, updateDto);
    }
    async getDropOffAnalysis(startDate, endDate, cohortId) {
        return await this.growthAnalyticsService.getDropOffAnalysis(startDate, endDate, cohortId);
    }
    async createCohort(createDto) {
        return await this.growthAnalyticsService.createCohort(createDto);
    }
    async getCohorts() {
        return await this.growthAnalyticsService.getCohorts();
    }
    async getCohort(id) {
        return await this.growthAnalyticsService.getCohort(id);
    }
    async deleteCohort(id) {
        return await this.growthAnalyticsService.deleteCohort(id);
    }
    async getCohortAnalysis(id) {
        return await this.growthAnalyticsService.getCohortAnalysis(id);
    }
    async getChartData(startDate, endDate, cohortId) {
        return await this.growthAnalyticsService.getChartData(startDate, endDate, cohortId);
    }
    async predictPlateaus(cohortId) {
        return await this.growthAnalyticsService.predictPlateaus(cohortId);
    }
    async getSegmentedLevels(startDate, endDate) {
        return await this.growthAnalyticsService.getSegmentedLevels(startDate, endDate);
    }
};
exports.GrowthAnalyticsController = GrowthAnalyticsController;
__decorate([
    (0, common_1.Post)("metrics"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new growth metric entry" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Metric created successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], GrowthAnalyticsController.prototype, "createMetric", null);
__decorate([
    (0, common_1.Post)("metrics/bulk"),
    (0, swagger_1.ApiOperation)({ summary: "Create multiple growth metrics at once" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Metrics created successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], GrowthAnalyticsController.prototype, "createMetricsBulk", null);
__decorate([
    (0, common_1.Get)("metrics"),
    (0, swagger_1.ApiOperation)({ summary: "Get growth metrics with filters" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Metrics retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], GrowthAnalyticsController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)("average-levels"),
    (0, swagger_1.ApiOperation)({ summary: "Get average user levels over time" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Average levels retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GrowthAnalyticsController.prototype, "getAverageLevels", null);
__decorate([
    (0, common_1.Get)("unlock-rates"),
    (0, swagger_1.ApiOperation)({ summary: "Get unlock rates over time" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Unlock rates retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GrowthAnalyticsController.prototype, "getUnlockRates", null);
__decorate([
    (0, common_1.Put)("metrics/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a growth metric (e.g., drop-off points)" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Metric updated successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], GrowthAnalyticsController.prototype, "updateMetric", null);
__decorate([
    (0, common_1.Get)("drop-off-analysis"),
    (0, swagger_1.ApiOperation)({ summary: "Analyze drop-off points by level" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Drop-off analysis retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GrowthAnalyticsController.prototype, "getDropOffAnalysis", null);
__decorate([
    (0, common_1.Post)("cohorts"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new cohort" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Cohort created successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], GrowthAnalyticsController.prototype, "createCohort", null);
__decorate([
    (0, common_1.Get)("cohorts"),
    (0, swagger_1.ApiOperation)({ summary: "Get all cohorts" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Cohorts retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GrowthAnalyticsController.prototype, "getCohorts", null);
__decorate([
    (0, common_1.Get)("cohorts/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a specific cohort" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Cohort retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GrowthAnalyticsController.prototype, "getCohort", null);
__decorate([
    (0, common_1.Delete)("cohorts/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: "Delete a cohort" }),
    (0, swagger_1.ApiResponse)({ status: 204, description: "Cohort deleted successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GrowthAnalyticsController.prototype, "deleteCohort", null);
__decorate([
    (0, common_1.Get)("cohorts/:id/analysis"),
    (0, swagger_1.ApiOperation)({ summary: "Get detailed analysis for a cohort" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Cohort analysis retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GrowthAnalyticsController.prototype, "getCohortAnalysis", null);
__decorate([
    (0, common_1.Get)("chart-data"),
    (0, swagger_1.ApiOperation)({ summary: "Get chart-ready JSON data for visualization" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Chart data retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GrowthAnalyticsController.prototype, "getChartData", null);
__decorate([
    (0, common_1.Get)("predict-plateaus"),
    (0, swagger_1.ApiOperation)({ summary: "Predict user level plateaus using trend analysis" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Plateau prediction retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GrowthAnalyticsController.prototype, "predictPlateaus", null);
__decorate([
    (0, common_1.Get)("segmented-levels"),
    (0, swagger_1.ApiOperation)({ summary: "Get user distribution across level segments" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Segmented levels retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GrowthAnalyticsController.prototype, "getSegmentedLevels", null);
exports.GrowthAnalyticsController = GrowthAnalyticsController = __decorate([
    (0, swagger_1.ApiTags)("Growth Analytics"),
    (0, common_1.Controller)("growth-analytics"),
    __metadata("design:paramtypes", [Function])
], GrowthAnalyticsController);
//# sourceMappingURL=growth-analytics.controller.js.map