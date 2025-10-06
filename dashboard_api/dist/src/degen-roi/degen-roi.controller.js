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
exports.DegenRoiController = void 0;
const common_1 = require("@nestjs/common");
const degen_roi_service_1 = require("./degen-roi.service");
const create_win_rate_dto_1 = require("./dto/create-win-rate.dto");
const update_roi_calc_dto_1 = require("./dto/update-roi-calc.dto");
const risk_metrics_dto_1 = require("./dto/risk-metrics.dto");
let DegenRoiController = class DegenRoiController {
    roiService;
    constructor(roiService) {
        this.roiService = roiService;
    }
    createWinRate(dto) {
        return this.roiService.createWinRate(dto);
    }
    getRiskMetrics(query) {
        return this.roiService.getRiskMetrics(query);
    }
    updateRoiCalc(id, dto) {
        return this.roiService.updateRoiCalc(id, dto);
    }
    deleteAnomalyReport(id) {
        return this.roiService.deleteAnomalyReport(id);
    }
    getOutcomeQueries(roomCategory) {
        return this.roiService.getOutcomeQueries(roomCategory);
    }
    getHistoricalComparison(roomCategory) {
        return this.roiService.getHistoricalComparison(roomCategory);
    }
    getLossAlerts(roomCategory) {
        return this.roiService.getLossAlerts(roomCategory);
    }
};
exports.DegenRoiController = DegenRoiController;
__decorate([
    (0, common_1.Post)('win-rates'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_win_rate_dto_1.CreateWinRateDto]),
    __metadata("design:returntype", void 0)
], DegenRoiController.prototype, "createWinRate", null);
__decorate([
    (0, common_1.Get)('risk-metrics'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [risk_metrics_dto_1.RiskMetricsQueryDto]),
    __metadata("design:returntype", void 0)
], DegenRoiController.prototype, "getRiskMetrics", null);
__decorate([
    (0, common_1.Put)('roi-calcs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_roi_calc_dto_1.UpdateRoiCalcDto]),
    __metadata("design:returntype", void 0)
], DegenRoiController.prototype, "updateRoiCalc", null);
__decorate([
    (0, common_1.Delete)('anomaly-reports/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DegenRoiController.prototype, "deleteAnomalyReport", null);
__decorate([
    (0, common_1.Get)('outcome-queries/:roomCategory'),
    __param(0, (0, common_1.Param)('roomCategory')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DegenRoiController.prototype, "getOutcomeQueries", null);
__decorate([
    (0, common_1.Get)('historical-compare/:roomCategory'),
    __param(0, (0, common_1.Param)('roomCategory')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DegenRoiController.prototype, "getHistoricalComparison", null);
__decorate([
    (0, common_1.Get)('loss-alerts'),
    __param(0, (0, common_1.Query)('roomCategory')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DegenRoiController.prototype, "getLossAlerts", null);
exports.DegenRoiController = DegenRoiController = __decorate([
    (0, common_1.Controller)('degen-roi'),
    __metadata("design:paramtypes", [degen_roi_service_1.DegenRoiService])
], DegenRoiController);
//# sourceMappingURL=degen-roi.controller.js.map