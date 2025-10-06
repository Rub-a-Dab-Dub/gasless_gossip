"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceMetricsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const finance_metrics_controller_1 = require("./finance-metrics.controller");
const finance_metrics_service_1 = require("./finance-metrics.service");
const daily_aggregate_entity_1 = require("./entities/daily-aggregate.entity");
let FinanceMetricsModule = class FinanceMetricsModule {
};
exports.FinanceMetricsModule = FinanceMetricsModule;
exports.FinanceMetricsModule = FinanceMetricsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([daily_aggregate_entity_1.DailyAggregate])],
        controllers: [finance_metrics_controller_1.FinanceMetricsController],
        providers: [finance_metrics_service_1.FinanceMetricsService],
        exports: [finance_metrics_service_1.FinanceMetricsService],
    })
], FinanceMetricsModule);
//# sourceMappingURL=finance-metrics.module.js.map