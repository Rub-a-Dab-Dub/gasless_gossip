"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DegenBadgesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const degen_badge_entity_1 = require("./entities/degen-badge.entity");
const degen_badges_service_1 = require("./services/degen-badges.service");
const stellar_badge_service_1 = require("./services/stellar-badge.service");
const degen_badges_controller_1 = require("./controllers/degen-badges.controller");
const badge_analytics_listener_1 = require("./listeners/badge-analytics.listener");
let DegenBadgesModule = class DegenBadgesModule {
};
exports.DegenBadgesModule = DegenBadgesModule;
exports.DegenBadgesModule = DegenBadgesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([degen_badge_entity_1.DegenBadge]), config_1.ConfigModule, event_emitter_1.EventEmitterModule],
        controllers: [degen_badges_controller_1.DegenBadgesController],
        providers: [degen_badges_service_1.DegenBadgesService, stellar_badge_service_1.StellarBadgeService, badge_analytics_listener_1.BadgeAnalyticsListener],
        exports: [degen_badges_service_1.DegenBadgesService, stellar_badge_service_1.StellarBadgeService],
    })
], DegenBadgesModule);
//# sourceMappingURL=degen-badges.module.js.map