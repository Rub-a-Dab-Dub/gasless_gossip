"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GossipModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const gossip_gateway_1 = require("./gossip.gateway");
const gossip_service_1 = require("./services/gossip.service");
const gossip_intent_entity_1 = require("./entities/gossip-intent.entity");
const gossip_update_entity_1 = require("./entities/gossip-update.entity");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../users/users.module");
const rooms_module_1 = require("../rooms/rooms.module");
let GossipModule = class GossipModule {
};
exports.GossipModule = GossipModule;
exports.GossipModule = GossipModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([gossip_intent_entity_1.GossipIntent, gossip_update_entity_1.GossipUpdate]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            rooms_module_1.RoomsModule,
        ],
        providers: [gossip_gateway_1.GossipGateway, gossip_service_1.GossipService],
        exports: [gossip_service_1.GossipService, gossip_gateway_1.GossipGateway],
    })
], GossipModule);
//# sourceMappingURL=gossip.module.js.map