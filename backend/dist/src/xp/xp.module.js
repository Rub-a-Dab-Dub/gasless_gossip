"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XpModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const xp_entity_1 = require("./xp.entity");
const processed_event_entity_1 = require("./processed-event.entity");
const stellar_account_entity_1 = require("./stellar-account.entity");
const xp_service_1 = require("./xp.service");
const xp_controller_1 = require("./xp.controller");
const stellar_listener_service_1 = require("./stellar-listener.service");
let XpModule = class XpModule {
};
exports.XpModule = XpModule;
exports.XpModule = XpModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([xp_entity_1.Xp, processed_event_entity_1.ProcessedEvent, stellar_account_entity_1.StellarAccount])],
        providers: [xp_service_1.XpService, stellar_listener_service_1.StellarListenerService],
        controllers: [xp_controller_1.XpController],
        exports: [xp_service_1.XpService],
    })
], XpModule);
//# sourceMappingURL=xp.module.js.map