"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.XpTransactionsModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const event_emitter_1 = require("@nestjs/event-emitter");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const redisStore = __importStar(require("cache-manager-redis-store"));
const xp_transaction_entity_1 = require("./entities/xp-transaction.entity");
const xp_transaction_controller_1 = require("./xp-transaction.controller");
const xp_transaction_service_1 = require("./xp-transaction.service");
const xp_transaction_repository_1 = require("./repositories/xp-transaction.repository");
const fraud_detection_listener_1 = require("./listeners/fraud-detection.listener");
let XpTransactionsModule = class XpTransactionsModule {
};
exports.XpTransactionsModule = XpTransactionsModule;
exports.XpTransactionsModule = XpTransactionsModule = __decorate([
    Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([xp_transaction_entity_1.XPTransaction]),
            cache_manager_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    store: redisStore,
                    host: configService.get('REDIS_HOST', 'localhost'),
                    port: configService.get('REDIS_PORT', 6379),
                    ttl: 300,
                }),
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    transport: {
                        host: configService.get('MAIL_HOST'),
                        port: configService.get('MAIL_PORT'),
                        auth: {
                            user: configService.get('MAIL_USER'),
                            pass: configService.get('MAIL_PASSWORD'),
                        },
                    },
                    defaults: {
                        from: configService.get('MAIL_FROM'),
                    },
                }),
            }),
        ],
        controllers: [xp_transaction_controller_1.XPTransactionController],
        providers: [xp_transaction_service_1.XPTransactionService, xp_transaction_repository_1.XPTransactionRepository, fraud_detection_listener_1.FraudDetectionListener],
        exports: [xp_transaction_service_1.XPTransactionService, xp_transaction_repository_1.XPTransactionRepository, fraud_detection_listener_1.FraudDetectionListener],
    })
], XpTransactionsModule);
//# sourceMappingURL=xp-transactions.module.js.map