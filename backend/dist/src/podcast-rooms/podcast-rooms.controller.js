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
exports.PodcastRoomsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const podcast_rooms_service_1 = require("./services/podcast-rooms.service");
const update_podcast_room_dto_1 = require("./dto/update-podcast-room.dto");
const create_podcast_room_dto_1 = require("./dto/create-podcast-room.dto");
let PodcastRoomsController = class PodcastRoomsController {
    podcastRoomsService;
    constructor(podcastRoomsService) {
        this.podcastRoomsService = podcastRoomsService;
    }
    async create(createPodcastRoomDto) {
        const podcastRoom = await this.podcastRoomsService.create(createPodcastRoomDto);
        return (0, class_transformer_1.plainToClass)(update_podcast_room_dto_1.PodcastRoomResponseDto, podcastRoom, {
            excludeExtraneousValues: true,
        });
    }
    async findAll(creatorId) {
        const podcastRooms = await this.podcastRoomsService.findAll(creatorId);
        return podcastRooms.map((room) => (0, class_transformer_1.plainToClass)(update_podcast_room_dto_1.PodcastRoomResponseDto, room, {
            excludeExtraneousValues: true,
        }));
    }
    async findOne(id) {
        const podcastRoom = await this.podcastRoomsService.findOne(id);
        return (0, class_transformer_1.plainToClass)(update_podcast_room_dto_1.PodcastRoomResponseDto, podcastRoom, {
            excludeExtraneousValues: true,
        });
    }
    async findByRoomId(roomId) {
        const podcastRoom = await this.podcastRoomsService.findByRoomId(roomId);
        return (0, class_transformer_1.plainToClass)(update_podcast_room_dto_1.PodcastRoomResponseDto, podcastRoom, {
            excludeExtraneousValues: true,
        });
    }
    async getAudioUrl(roomId) {
        const audioUrl = await this.podcastRoomsService.getAudioUrl(roomId);
        return { audioUrl };
    }
    async update(id, updatePodcastRoomDto) {
        const userId = 'temp-user-id';
        const podcastRoom = await this.podcastRoomsService.update(id, updatePodcastRoomDto, userId);
        return (0, class_transformer_1.plainToClass)(update_podcast_room_dto_1.PodcastRoomResponseDto, podcastRoom, {
            excludeExtraneousValues: true,
        });
    }
    async remove(id) {
        const userId = 'temp-user-id';
        await this.podcastRoomsService.remove(id, userId);
    }
    async verifyAccess(roomId) {
        const userId = 'temp-user-id';
        const hasAccess = await this.podcastRoomsService.verifyAccess(roomId, userId);
        return { hasAccess };
    }
};
exports.PodcastRoomsController = PodcastRoomsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new podcast room' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Podcast room created successfully',
        type: update_podcast_room_dto_1.PodcastRoomResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Room ID already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_podcast_room_dto_1.CreatePodcastRoomDto]),
    __metadata("design:returntype", Promise)
], PodcastRoomsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all podcast rooms' }),
    (0, swagger_1.ApiQuery)({
        name: 'creatorId',
        required: false,
        description: 'Filter by creator ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of podcast rooms',
        type: [update_podcast_room_dto_1.PodcastRoomResponseDto],
    }),
    __param(0, (0, common_1.Query)('creatorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PodcastRoomsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a podcast room by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Podcast room ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Podcast room details',
        type: update_podcast_room_dto_1.PodcastRoomResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Podcast room not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PodcastRoomsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('room/:roomId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a podcast room by room ID' }),
    (0, swagger_1.ApiParam)({ name: 'roomId', description: 'Room identifier' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Podcast room details',
        type: update_podcast_room_dto_1.PodcastRoomResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Podcast room not found' }),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PodcastRoomsController.prototype, "findByRoomId", null);
__decorate([
    (0, common_1.Get)(':roomId/audio-url'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audio URL for a podcast room' }),
    (0, swagger_1.ApiParam)({ name: 'roomId', description: 'Room identifier' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audio URL' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Audio content not found' }),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PodcastRoomsController.prototype, "getAudioUrl", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a podcast room' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Podcast room ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Podcast room updated successfully',
        type: update_podcast_room_dto_1.PodcastRoomResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not the creator' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Podcast room not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_podcast_room_dto_1.UpdatePodcastRoomDto]),
    __metadata("design:returntype", Promise)
], PodcastRoomsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a podcast room' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Podcast room ID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Podcast room deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not the creator' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Podcast room not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PodcastRoomsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':roomId/verify-access'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify access to a podcast room' }),
    (0, swagger_1.ApiParam)({ name: 'roomId', description: 'Room identifier' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Access verification result' }),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PodcastRoomsController.prototype, "verifyAccess", null);
exports.PodcastRoomsController = PodcastRoomsController = __decorate([
    (0, swagger_1.ApiTags)('Podcast Rooms'),
    (0, common_1.Controller)('podcast-rooms'),
    __metadata("design:paramtypes", [podcast_rooms_service_1.PodcastRoomsService])
], PodcastRoomsController);
//# sourceMappingURL=podcast-rooms.controller.js.map