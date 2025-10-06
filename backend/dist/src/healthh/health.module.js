"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthModule = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const health_controller_1 = require("../controllers/health.controller");
const redis_health_1 = require("./redis.health");
const uptime_logger_service_1 = require("./uptime-logger.service");
const uptime_log_entity_1 = require("../entities/uptime-log.entity");
let HealthModule = class HealthModule {
};
exports.HealthModule = HealthModule;
exports.HealthModule = HealthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            terminus_1.TerminusModule,
            typeorm_1.TypeOrmModule.forFeature([uptime_log_entity_1.UptimeLog]),
            schedule_1.ScheduleModule.forRoot()
        ],
        controllers: [health_controller_1.HealthController],
        providers: [redis_health_1.RedisHealthIndicator, uptime_logger_service_1.UptimeLoggerService],
    })
], HealthModule);
//# sourceMappingURL=health.module.js.map