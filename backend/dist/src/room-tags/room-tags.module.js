"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomTagsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const room_tags_controller_1 = require("./room-tags.controller");
const room_tags_service_1 = require("./room-tags.service");
const room_tag_entity_1 = require("./entities/room-tag.entity");
const room_entity_1 = require("../rooms/entities/room.entity");
const room_membership_entity_1 = require("../rooms/entities/room-membership.entity");
const auth_module_1 = require("../auth/auth.module");
let RoomTagsModule = class RoomTagsModule {
};
exports.RoomTagsModule = RoomTagsModule;
exports.RoomTagsModule = RoomTagsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([room_tag_entity_1.RoomTag, room_entity_1.Room, room_membership_entity_1.RoomMembership]),
            auth_module_1.AuthModule,
        ],
        controllers: [room_tags_controller_1.RoomTagsController],
        providers: [room_tags_service_1.RoomTagsService],
        exports: [room_tags_service_1.RoomTagsService],
    })
], RoomTagsModule);
//# sourceMappingURL=room-tags.module.js.map