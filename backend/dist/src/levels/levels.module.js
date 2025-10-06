"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const config_1 = require("@nestjs/config");
const level_entity_1 = require("./entities/level.entity");
const levels_service_1 = require("./services/levels.service");
const stellar_service_1 = require("./services/stellar.service");
const notification_service_1 = require("./services/notification.service");
const analytics_service_1 = require("./services/analytics.service");
const dynamic_xp_thresholds_service_1 = require("./config/dynamic-xp-thresholds.service");
const levels_controller_1 = require("./controllers/levels.controller");
const stellar_controller_1 = require("./controllers/stellar.controller");
const config_controller_1 = require("./controllers/config.controller");
const level_up_listener_1 = require("./listeners/level-up.listener");
const notification_listener_1 = require("./listeners/notification.listener");
const levels_gateway_1 = require("./gateways/levels.gateway");
const stellar_config_1 = require("./config/stellar.config");
let LevelsModule = class LevelsModule {
};
exports.LevelsModule = LevelsModule;
exports.LevelsModule = LevelsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([level_entity_1.Level]),
            event_emitter_1.EventEmitterModule.forRoot(),
            config_1.ConfigModule.forFeature(stellar_config_1.stellarConfigFactory),
        ],
        controllers: [levels_controller_1.LevelsController, stellar_controller_1.StellarController, config_controller_1.ConfigController],
        providers: [
            levels_service_1.LevelsService,
            stellar_service_1.StellarService,
            notification_service_1.NotificationService,
            analytics_service_1.AnalyticsService,
            dynamic_xp_thresholds_service_1.DynamicXpThresholdsService,
            level_up_listener_1.LevelUpListener,
            notification_listener_1.NotificationListener,
            levels_gateway_1.LevelsGateway,
            {
                provide: stellar_config_1.STELLAR_CONFIG_TOKEN,
                useFactory: stellar_config_1.stellarConfigFactory,
            },
        ],
        exports: [levels_service_1.LevelsService, stellar_service_1.StellarService, dynamic_xp_thresholds_service_1.DynamicXpThresholdsService],
    })
], LevelsModule);
//# sourceMappingURL=levels.module.js.map