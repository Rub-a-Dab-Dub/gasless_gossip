"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatedRoomsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const gated_rooms_controller_1 = require("./gated-rooms.controller");
const gated_rooms_service_1 = require("./gated-rooms.service");
const gated_room_entity_1 = require("./entities/gated-room.entity");
let GatedRoomsModule = class GatedRoomsModule {
};
exports.GatedRoomsModule = GatedRoomsModule;
exports.GatedRoomsModule = GatedRoomsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([gated_room_entity_1.GatedRoom])],
        controllers: [gated_rooms_controller_1.GatedRoomsController],
        providers: [gated_rooms_service_1.GatedRoomsService],
        exports: [gated_rooms_service_1.GatedRoomsService],
    })
], GatedRoomsModule);
//# sourceMappingURL=gated-rooms.module.js.map