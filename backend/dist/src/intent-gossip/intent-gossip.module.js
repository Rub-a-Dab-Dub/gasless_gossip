"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentGossipModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const intent_gossip_service_1 = require("./intent-gossip.service");
const gossip_controller_1 = require("./gossip.controller");
const intent_log_entity_1 = require("./entities/intent-log.entity");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../users/users.module");
let IntentGossipModule = class IntentGossipModule {
};
exports.IntentGossipModule = IntentGossipModule;
exports.IntentGossipModule = IntentGossipModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([intent_log_entity_1.IntentLog]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
        ],
        controllers: [gossip_controller_1.GossipController],
        providers: [intent_gossip_service_1.IntentGossipService],
        exports: [intent_gossip_service_1.IntentGossipService],
    })
], IntentGossipModule);
//# sourceMappingURL=intent-gossip.module.js.map