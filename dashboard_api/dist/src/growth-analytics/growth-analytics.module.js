"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrowthAnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const growth_analytics_controller_1 = require("./growth-analytics.controller");
const growth_analytics_service_1 = require("./growth-analytics.service");
const growth_metric_entity_1 = require("./entities/growth-metric.entity");
const cohort_entity_1 = require("./entities/cohort.entity");
let GrowthAnalyticsModule = class GrowthAnalyticsModule {
};
exports.GrowthAnalyticsModule = GrowthAnalyticsModule;
exports.GrowthAnalyticsModule = GrowthAnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([growth_metric_entity_1.GrowthMetric, cohort_entity_1.Cohort])],
        controllers: [growth_analytics_controller_1.GrowthAnalyticsController],
        providers: [growth_analytics_service_1.GrowthAnalyticsService],
        exports: [growth_analytics_service_1.GrowthAnalyticsService],
    })
], GrowthAnalyticsModule);
//# sourceMappingURL=growth-analytics.module.js.map