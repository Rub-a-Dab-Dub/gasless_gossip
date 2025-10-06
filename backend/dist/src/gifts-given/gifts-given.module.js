"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftsGivenModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const gifts_given_controller_1 = require("./gifts-given.controller");
const gifts_given_service_1 = require("./gifts-given.service");
const gift_log_entity_1 = require("./entities/gift-log.entity");
const gift_analytics_listener_1 = require("./listeners/gift-analytics.listener");
let GiftsGivenModule = class GiftsGivenModule {
};
exports.GiftsGivenModule = GiftsGivenModule;
exports.GiftsGivenModule = GiftsGivenModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([gift_log_entity_1.GiftLog]),
            event_emitter_1.EventEmitterModule.forRoot(),
        ],
        controllers: [gifts_given_controller_1.GiftsGivenController],
        providers: [gifts_given_service_1.GiftsGivenService, gift_analytics_listener_1.GiftAnalyticsListener],
        exports: [gifts_given_service_1.GiftsGivenService],
    })
], GiftsGivenModule);
//# sourceMappingURL=gifts-given.module.js.map