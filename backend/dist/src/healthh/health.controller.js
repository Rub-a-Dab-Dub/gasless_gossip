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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const redis_health_1 = require("./redis.health");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uptime_log_entity_1 = require("../entities/uptime-log.entity");
let HealthController = class HealthController {
    health;
    db;
    redis;
    uptimeRepo;
    constructor(health, db, redis, uptimeRepo) {
        this.health = health;
        this.db = db;
        this.redis = redis;
        this.uptimeRepo = uptimeRepo;
    }
    async check() {
        const result = await this.health.check([
            async () => this.db.pingCheck('db'),
            async () => this.redis.isHealthy('redis'),
        ]);
        return {
            status: result.status,
            db: result.info?.db?.status || 'down',
            redis: result.info?.redis?.status || 'down',
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, terminus_1.HealthCheck)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('api/health'),
    __param(3, (0, typeorm_1.InjectRepository)(uptime_log_entity_1.UptimeLog)),
    __metadata("design:paramtypes", [typeof (_a = typeof terminus_1.HealthCheckService !== "undefined" && terminus_1.HealthCheckService) === "function" ? _a : Object, typeof (_b = typeof terminus_1.TypeOrmHealthIndicator !== "undefined" && terminus_1.TypeOrmHealthIndicator) === "function" ? _b : Object, redis_health_1.RedisHealthIndicator,
        typeorm_2.Repository])
], HealthController);
//# sourceMappingURL=health.controller.js.map