"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretRoomsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const secret_room_entity_1 = require("./entities/secret-room.entity");
const room_invitation_entity_1 = require("./entities/room-invitation.entity");
const room_member_entity_1 = require("./entities/room-member.entity");
const secret_rooms_service_1 = require("./services/secret-rooms.service");
const secret_rooms_controller_1 = require("./secret-rooms.controller");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../users/users.module");
const config_1 = require("@nestjs/config");
let SecretRoomsModule = class SecretRoomsModule {
};
exports.SecretRoomsModule = SecretRoomsModule;
exports.SecretRoomsModule = SecretRoomsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([secret_room_entity_1.SecretRoom, room_invitation_entity_1.RoomInvitation, room_member_entity_1.RoomMember]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            config_1.ConfigModule,
        ],
        controllers: [secret_rooms_controller_1.SecretRoomsController],
        providers: [secret_rooms_service_1.SecretRoomsService],
        exports: [secret_rooms_service_1.SecretRoomsService],
    })
], SecretRoomsModule);
//# sourceMappingURL=secret-rooms.module.js.map