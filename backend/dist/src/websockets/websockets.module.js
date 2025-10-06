"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketsModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const websockets_entity_1 = require("./websockets.entity");
const common_1 = require("@nestjs/common");
const websockets_gateway_1 = require("./websockets.gateway");
const websockets_service_1 = require("./websockets.service");
const rooms_module_1 = require("../rooms/rooms.module");
let WebSocketsModule = class WebSocketsModule {
};
exports.WebSocketsModule = WebSocketsModule;
exports.WebSocketsModule = WebSocketsModule = __decorate([
    (0, common_1.Module)({
        imports: [rooms_module_1.RoomsModule, typeorm_1.TypeOrmModule.forFeature([websockets_entity_1.Message, websockets_entity_1.Notification])],
        providers: [websockets_gateway_1.WebSocketsGateway, websockets_service_1.WebSocketsService],
        exports: [websockets_service_1.WebSocketsService, websockets_gateway_1.WebSocketsGateway],
    })
], WebSocketsModule);
//# sourceMappingURL=websockets.module.js.map