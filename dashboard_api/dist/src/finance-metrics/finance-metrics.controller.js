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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceMetricsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const finance_metrics_service_1 = require("./finance-metrics.service");
const query_dto_1 = require("./dto/query.dto");
const response_dto_1 = require("./dto/response.dto");
const daily_aggregate_entity_1 = require("./entities/daily-aggregate.entity");
let FinanceMetricsController = class FinanceMetricsController {
    financeMetricsService;
    constructor(financeMetricsService) {
        this.financeMetricsService = financeMetricsService;
    }
    createDailyAggregate(date) {
        return this.financeMetricsService.createDailyAggregate(new Date(date));
    }
    getTopUsers(query) {
        return this.financeMetricsService.getTopUsers(new Date(query.startDate), new Date(query.endDate), query.limit);
    }
    updateTrendForecast(id) {
        return this.financeMetricsService.updateTrendForecast(id);
    }
    deleteSpike(id) {
        return this.financeMetricsService.deleteSpikeAlert(id);
    }
    compareROI(query) {
        return this.financeMetricsService.compareROI(new Date(query.period1Start), new Date(query.period1End), new Date(query.period2Start), new Date(query.period2End));
    }
};
exports.FinanceMetricsController = FinanceMetricsController;
__decorate([
    (0, common_1.Post)('daily-aggregate'),
    (0, swagger_1.ApiOperation)({ summary: 'Create daily aggregate metrics' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: daily_aggregate_entity_1.DailyAggregate }),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinanceMetricsController.prototype, "createDailyAggregate", null);
__decorate([
    (0, common_1.Get)('top-users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top users by volume within date range' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [response_dto_1.TopUserResponse] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.TopUsersQuery]),
    __metadata("design:returntype", Promise)
], FinanceMetricsController.prototype, "getTopUsers", null);
__decorate([
    (0, common_1.Patch)(':id/trend-forecast'),
    (0, swagger_1.ApiOperation)({ summary: 'Update trend forecast for specific aggregate' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_dto_1.TrendForecastResponse }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinanceMetricsController.prototype, "updateTrendForecast", null);
__decorate([
    (0, common_1.Delete)(':id/spike'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete spike alert' }),
    (0, swagger_1.ApiResponse)({ status: 204 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinanceMetricsController.prototype, "deleteSpike", null);
__decorate([
    (0, common_1.Get)('roi-comparison'),
    (0, swagger_1.ApiOperation)({ summary: 'Compare ROI between two periods' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_dto_1.ROIComparisonResponse }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.ComparePeriodsQuery]),
    __metadata("design:returntype", Promise)
], FinanceMetricsController.prototype, "compareROI", null);
exports.FinanceMetricsController = FinanceMetricsController = __decorate([
    (0, swagger_1.ApiTags)('Finance Metrics'),
    (0, common_1.Controller)('finance-metrics'),
    __metadata("design:paramtypes", [finance_metrics_service_1.FinanceMetricsService])
], FinanceMetricsController);
//# sourceMappingURL=finance-metrics.controller.js.map