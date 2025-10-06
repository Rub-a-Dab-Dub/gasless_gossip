"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkRoomActionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bulk_room_action_controller_1 = require("./bulk-room-action.controller");
const bulk_room_action_service_1 = require("./bulk-room-action.service");
const bulk_action_entity_1 = require("./entities/bulk-action.entity");
const room_action_result_entity_1 = require("./entities/room-action-result.entity");
const bulk_action_notification_entity_1 = require("./entities/bulk-action-notification.entity");
let BulkRoomActionModule = class BulkRoomActionModule {
};
exports.BulkRoomActionModule = BulkRoomActionModule;
exports.BulkRoomActionModule = BulkRoomActionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([bulk_action_entity_1.BulkAction, room_action_result_entity_1.RoomActionResult, bulk_action_notification_entity_1.BulkActionNotification])],
        controllers: [bulk_room_action_controller_1.BulkRoomActionController],
        providers: [bulk_room_action_service_1.BulkRoomActionService],
        exports: [bulk_room_action_service_1.BulkRoomActionService],
    })
], BulkRoomActionModule);
//# sourceMappingURL=bulk-room-action.module.js.map