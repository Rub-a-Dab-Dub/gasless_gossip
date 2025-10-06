"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DauMetricsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dau_metrics_controller_1 = require("./dau-metrics.controller");
const dau_metrics_service_1 = require("./dau-metrics.service");
const dau_metric_entity_1 = require("./entities/dau-metric.entity");
const dau_alert_entity_1 = require("./entities/dau-alert.entity");
const feature_usage_entity_1 = require("./entities/feature-usage.entity");
const dau_metrics_gateway_1 = require("./dau-metrics.gateway");
let DauMetricsModule = class DauMetricsModule {
};
exports.DauMetricsModule = DauMetricsModule;
exports.DauMetricsModule = DauMetricsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([dau_metric_entity_1.DauMetric, dau_alert_entity_1.DauAlert, feature_usage_entity_1.FeatureUsage])],
        controllers: [dau_metrics_controller_1.DauMetricsController],
        providers: [dau_metrics_service_1.DauMetricsService, dau_metrics_gateway_1.DauMetricsGateway],
        exports: [dau_metrics_service_1.DauMetricsService],
    })
], DauMetricsModule);
//# sourceMappingURL=dau-metrics.module.js.map