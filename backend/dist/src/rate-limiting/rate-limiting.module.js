"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitingModule = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const rate_limit_violation_entity_1 = require("./entities/rate-limit-violation.entity");
const rate_limit_service_1 = require("./services/rate-limit.service");
const rate_limit_controller_1 = require("./rate-limit.controller");
const config_1 = require("@nestjs/config");
let RateLimitingModule = class RateLimitingModule {
};
exports.RateLimitingModule = RateLimitingModule;
exports.RateLimitingModule = RateLimitingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => [
                    {
                        name: 'short',
                        ttl: 60000,
                        limit: configService.get('RATE_LIMIT_SHORT', 100),
                    },
                    {
                        name: 'medium',
                        ttl: 300000,
                        limit: configService.get('RATE_LIMIT_MEDIUM', 500),
                    },
                    {
                        name: 'long',
                        ttl: 3600000,
                        limit: configService.get('RATE_LIMIT_LONG', 2000),
                    },
                ],
            }),
            typeorm_1.TypeOrmModule.forFeature([rate_limit_violation_entity_1.RateLimitViolation]),
        ],
        controllers: [rate_limit_controller_1.RateLimitController],
        providers: [
            rate_limit_service_1.RateLimitService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
        exports: [rate_limit_service_1.RateLimitService],
    })
], RateLimitingModule);
//# sourceMappingURL=rate-limiting.module.js.map