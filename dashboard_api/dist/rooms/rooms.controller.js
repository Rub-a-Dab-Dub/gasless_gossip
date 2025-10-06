"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rooms_service_1 = require("./services/rooms.service");
const room_export_service_1 = require("./services/room-export.service");
const room_events_gateway_1 = require("./events/room-events.gateway");
const create_room_dto_1 = require("./dto/create-room.dto");
const update_room_dto_1 = require("./dto/update-room.dto");
const query_rooms_dto_1 = require("./dto/query-rooms.dto");
const bulk_update_rooms_dto_1 = require("./dto/bulk-update-rooms.dto");
const moderator_guard_1 = require("./guards/moderator.guard");
const roles_decorator_1 = require("../shared/decorators/roles.decorator");
let RoomsController = class RoomsController {
    roomsService;
    exportService;
    eventsGateway;
    constructor(roomsService, exportService, eventsGateway) {
        this.roomsService = roomsService;
        this.exportService = exportService;
        this.eventsGateway = eventsGateway;
    }
    async create(dto, req) {
        const creatorId = req.user.id;
        return this.roomsService.create(dto, creatorId);
    }
    async findAll(query, req) {
        const isModerator = req.user.role === 'moderator';
        return this.roomsService.findAll(query, isModerator);
    }
    async findOne(id, req) {
        const isModerator = req.user.role === 'moderator';
        return this.roomsService.findOne(id, isModerator);
    }
    async update(id, dto) {
        return this.roomsService.update(id, dto);
    }
    async bulkUpdate(dto) {
        return this.roomsService.bulkUpdate(dto);
    }
    async softDelete(id) {
        await this.roomsService.softDelete(id);
        await this.eventsGateway.notifyParticipants(id, 'Room has been closed');
    }
    async hardDelete(id) {
        await this.eventsGateway.notifyParticipants(id, 'Room will be deleted');
        await this.roomsService.hardDelete(id);
    }
    async exportActivity(id, res) {
        const csv = await this.exportService.exportParticipantActivity(id);
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', `attachment; filename="room-${id}-activity.csv"`);
        res.send(csv);
    }
};
exports.RoomsController = RoomsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new room' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_room_dto_1.CreateRoomDto !== "undefined" && create_room_dto_1.CreateRoomDto) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all rooms with filters' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof query_rooms_dto_1.QueryRoomsDto !== "undefined" && query_rooms_dto_1.QueryRoomsDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get room details' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update room settings' }),
    (0, roles_decorator_1.Moderator)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_room_dto_1.UpdateRoomDto !== "undefined" && update_room_dto_1.UpdateRoomDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk update multiple rooms' }),
    (0, roles_decorator_1.Moderator)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof bulk_update_rooms_dto_1.BulkUpdateRoomsDto !== "undefined" && bulk_update_rooms_dto_1.BulkUpdateRoomsDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "bulkUpdate", null);
__decorate([
    (0, common_1.Delete)(':id/soft'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete room (close)' }),
    (0, roles_decorator_1.Moderator)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Delete)(':id/hard'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Hard delete room with cascade' }),
    (0, roles_decorator_1.Moderator)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "hardDelete", null);
__decorate([
    (0, common_1.Get)(':id/export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export participant activity as CSV' }),
    (0, roles_decorator_1.Moderator)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "exportActivity", null);
exports.RoomsController = RoomsController = __decorate([
    (0, swagger_1.ApiTags)('rooms'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('rooms'),
    (0, common_1.UseGuards)(moderator_guard_1.ModeratorGuard),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService,
        room_export_service_1.RoomExportService,
        room_events_gateway_1.RoomEventsGateway])
], RoomsController);
//# sourceMappingURL=rooms.controller.js.map