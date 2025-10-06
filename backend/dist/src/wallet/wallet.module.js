"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const wallet_balance_entity_1 = require("./entities/wallet-balance.entity");
const wallet_service_1 = require("./services/wallet.service");
const wallet_controller_1 = require("./wallet.controller");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../users/users.module");
const config_1 = require("@nestjs/config");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_redis_store_1 = require("cache-manager-redis-store");
let WalletModule = class WalletModule {
};
exports.WalletModule = WalletModule;
exports.WalletModule = WalletModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([wallet_balance_entity_1.WalletBalance]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            config_1.ConfigModule,
            cache_manager_1.CacheModule.registerAsync({
                useFactory: async () => ({
                    store: cache_manager_redis_store_1.redisStore,
                    host: process.env.REDIS_HOST || 'localhost',
                    port: process.env.REDIS_PORT || 6379,
                    password: process.env.REDIS_PASSWORD,
                    ttl: 60,
                }),
            }),
        ],
        controllers: [wallet_controller_1.WalletController],
        providers: [wallet_service_1.WalletService],
        exports: [wallet_service_1.WalletService],
    })
], WalletModule);
//# sourceMappingURL=wallet.module.js.map