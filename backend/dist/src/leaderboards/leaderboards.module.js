"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const event_emitter_1 = require("@nestjs/event-emitter");
const config_1 = require("@nestjs/config");
const level_entity_1 = require("../levels/entities/level.entity");
const leaderboards_service_1 = require("./services/leaderboards.service");
const leaderboards_controller_1 = require("./controllers/leaderboards.controller");
const leaderboard_cache_listener_1 = require("./listeners/leaderboard-cache.listener");
let LeaderboardsModule = class LeaderboardsModule {
};
exports.LeaderboardsModule = LeaderboardsModule;
exports.LeaderboardsModule = LeaderboardsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([level_entity_1.Level]),
            cache_manager_1.CacheModule.register({
                ttl: 300,
                max: 1000,
            }),
            event_emitter_1.EventEmitterModule,
            config_1.ConfigModule,
        ],
        controllers: [leaderboards_controller_1.LeaderboardsController],
        providers: [leaderboards_service_1.LeaderboardsService, leaderboard_cache_listener_1.LeaderboardCacheListener],
        exports: [leaderboards_service_1.LeaderboardsService],
    })
], LeaderboardsModule);
//# sourceMappingURL=leaderboards.module.js.map