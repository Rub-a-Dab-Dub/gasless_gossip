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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomTagsController = void 0;
const common_1 = require("@nestjs/common");
const room_tags_service_1 = require("./room-tags.service");
const create_room_tag_dto_1 = require("./dto/create-room-tag.dto");
const search_rooms_by_tag_dto_1 = require("./dto/search-rooms-by-tag.dto");
const delete_room_tag_dto_1 = require("./dto/delete-room-tag.dto");
const auth_guard_1 = require("../auth/auth.guard");
let RoomTagsController = class RoomTagsController {
    roomTagsService;
    constructor(roomTagsService) {
        this.roomTagsService = roomTagsService;
    }
    async createRoomTag(req, createRoomTagDto) {
        return this.roomTagsService.createRoomTag(createRoomTagDto, req.user.id);
    }
    async createMultipleRoomTags(req, createMultipleTagsDto) {
        return this.roomTagsService.createMultipleRoomTags(createMultipleTagsDto, req.user.id);
    }
    async deleteRoomTag(req, deleteRoomTagDto) {
        return this.roomTagsService.deleteRoomTag(deleteRoomTagDto, req.user.id);
    }
    async getRoomTags(roomId) {
        return this.roomTagsService.getRoomTags(roomId);
    }
    async searchRoomsByTag(tag, limit, offset) {
        return this.roomTagsService.searchRoomsByTag({
            tag,
            limit,
            offset,
        });
    }
    async searchRoomsByMultipleTags(searchDto) {
        return this.roomTagsService.searchRoomsByMultipleTags(searchDto);
    }
    async getPopularTags(limit) {
        return this.roomTagsService.getPopularTags(limit);
    }
    async getAllTags() {
        return this.roomTagsService.getAllTags();
    }
};
exports.RoomTagsController = RoomTagsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_room_tag_dto_1.CreateRoomTagDto]),
    __metadata("design:returntype", Promise)
], RoomTagsController.prototype, "createRoomTag", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_room_tag_dto_1.CreateMultipleRoomTagsDto]),
    __metadata("design:returntype", Promise)
], RoomTagsController.prototype, "createMultipleRoomTags", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delete_room_tag_dto_1.DeleteRoomTagDto]),
    __metadata("design:returntype", Promise)
], RoomTagsController.prototype, "deleteRoomTag", null);
__decorate([
    (0, common_1.Get)('room/:roomId'),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomTagsController.prototype, "getRoomTags", null);
__decorate([
    (0, common_1.Get)('search/:tag'),
    __param(0, (0, common_1.Param)('tag')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], RoomTagsController.prototype, "searchRoomsByTag", null);
__decorate([
    (0, common_1.Post)('search'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_rooms_by_tag_dto_1.SearchRoomsByMultipleTagsDto]),
    __metadata("design:returntype", Promise)
], RoomTagsController.prototype, "searchRoomsByMultipleTags", null);
__decorate([
    (0, common_1.Get)('popular'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RoomTagsController.prototype, "getPopularTags", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoomTagsController.prototype, "getAllTags", null);
exports.RoomTagsController = RoomTagsController = __decorate([
    (0, common_1.Controller)('room-tags'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [room_tags_service_1.RoomTagsService])
], RoomTagsController);
//# sourceMappingURL=room-tags.controller.js.map