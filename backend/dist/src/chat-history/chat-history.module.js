"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHistoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_message_entity_1 = require("./entities/chat-message.entity");
const chat_history_service_1 = require("./services/chat-history.service");
const chat_history_controller_1 = require("./chat-history.controller");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_redis_store_1 = require("cache-manager-redis-store");
const config_1 = require("@nestjs/config");
let ChatHistoryModule = class ChatHistoryModule {
};
exports.ChatHistoryModule = ChatHistoryModule;
exports.ChatHistoryModule = ChatHistoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([chat_message_entity_1.ChatMessage]),
            cache_manager_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    store: cache_manager_redis_store_1.redisStore,
                    host: configService.get('REDIS_HOST', 'localhost'),
                    port: configService.get('REDIS_PORT', 6379),
                    password: configService.get('REDIS_PASSWORD'),
                    ttl: 300,
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [chat_history_controller_1.ChatHistoryController],
        providers: [chat_history_service_1.ChatHistoryService],
        exports: [chat_history_service_1.ChatHistoryService],
    })
], ChatHistoryModule);
//# sourceMappingURL=chat-history.module.js.map