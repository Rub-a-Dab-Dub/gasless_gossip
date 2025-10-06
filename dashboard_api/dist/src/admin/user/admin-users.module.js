"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const throttler_1 = require("@nestjs/throttler");
const user_entity_1 = require("../../user/entities/user.entity");
const pseudonym_entity_1 = require("../../pseudonym/entities/pseudonym.entity");
const wallet_entity_1 = require("../../wallet/entities/wallet.entity");
const audit_log_entity_1 = require("../../audit-log/entities/audit-log.entity");
const admin_users_controller_1 = require("./admin-users.controller");
const admin_users_service_1 = require("./admin-users.service");
let AdminUsersModule = class AdminUsersModule {
};
exports.AdminUsersModule = AdminUsersModule;
exports.AdminUsersModule = AdminUsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, pseudonym_entity_1.Pseudonym, wallet_entity_1.Wallet, audit_log_entity_1.AuditLog]),
            cache_manager_1.CacheModule.register({
                host: process.env.REDIS_HOST || 'localhost',
                port: process.env.REDIS_PORT || 6379,
                ttl: 300,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
        ],
        controllers: [admin_users_controller_1.AdminUsersController],
        providers: [admin_users_service_1.AdminUsersService],
        exports: [admin_users_service_1.AdminUsersService],
    })
], AdminUsersModule);
//# sourceMappingURL=admin-users.module.js.map