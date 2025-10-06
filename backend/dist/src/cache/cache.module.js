"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
Object.defineProperty(exports, "CacheModule", { enumerable: true, get: function () { return cache_manager_1.CacheModule; } });
const config_1 = require("@nestjs/config");
const cache_manager_redis_store_1 = require("cache-manager-redis-store");
let CacheModule = class CacheModule {
};
exports.CacheModule = CacheModule;
exports.CacheModule = cache_manager_1.CacheModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const redisUrl = configService.get('REDIS_URL', 'redis://localhost:6379');
                    return {
                        store: cache_manager_redis_store_1.redisStore,
                        url: redisUrl,
                        ttl: 300,
                        max: 1000,
                        isGlobal: true,
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
        exports: [cache_manager_1.CacheModule],
    })
], cache_manager_1.CacheModule);
//# sourceMappingURL=cache.module.js.map