"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanGiftingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const fan_gift_entity_1 = require("./entities/fan-gift.entity");
const fan_gifting_controller_1 = require("./controllers/fan-gifting.controller");
const fan_gifting_service_1 = require("./services/fan-gifting.service");
const stellar_service_1 = require("./services/stellar.service");
let FanGiftingModule = class FanGiftingModule {
};
exports.FanGiftingModule = FanGiftingModule;
exports.FanGiftingModule = FanGiftingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([fan_gift_entity_1.FanGift]),
            config_1.ConfigModule
        ],
        controllers: [fan_gifting_controller_1.FanGiftingController],
        providers: [fan_gifting_service_1.FanGiftingService, stellar_service_1.StellarService],
        exports: [fan_gifting_service_1.FanGiftingService, stellar_service_1.StellarService]
    })
], FanGiftingModule);
//# sourceMappingURL=fan-gifting.module.js.map