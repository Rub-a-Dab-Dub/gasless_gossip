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
exports.PumpRoomsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pump_rooms_service_1 = require("../services/pump-rooms.service");
const create_pump_room_dto_1 = require("../dto/create-pump-room.dto");
const vote_dto_1 = require("../dto/vote.dto");
let PumpRoomsController = class PumpRoomsController {
    pumpRoomsService;
    constructor(pumpRoomsService) {
        this.pumpRoomsService = pumpRoomsService;
    }
    async createRoom(createPumpRoomDto) {
        const room = await this.pumpRoomsService.createRoom(createPumpRoomDto);
        return {
            success: true,
            message: 'Pump room created successfully',
            data: room
        };
    }
    async vote(voteDto) {
        const result = await this.pumpRoomsService.vote(voteDto);
        return {
            success: true,
            message: 'Vote recorded successfully',
            data: result
        };
    }
    async getRoom(roomId) {
        const room = await this.pumpRoomsService.getRoomById(roomId);
        return {
            success: true,
            data: room
        };
    }
    async getVotingData(roomId) {
        const votingData = await this.pumpRoomsService.getVotingData(roomId);
        return {
            success: true,
            data: votingData
        };
    }
    async getActiveRooms() {
        const rooms = await this.pumpRoomsService.getAllActiveRooms();
        return {
            success: true,
            data: rooms
        };
    }
};
exports.PumpRoomsController = PumpRoomsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new pump room' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Room created successfully' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input data' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pump_room_dto_1.CreatePumpRoomDto]),
    __metadata("design:returntype", Promise)
], PumpRoomsController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Post)('vote'),
    (0, swagger_1.ApiOperation)({ summary: 'Vote on a prediction in a pump room' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Vote recorded successfully' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid vote data' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Room not found' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vote_dto_1.VoteDto]),
    __metadata("design:returntype", Promise)
], PumpRoomsController.prototype, "vote", null);
__decorate([
    (0, common_1.Get)(':roomId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get room details by ID' }),
    (0, swagger_1.ApiParam)({ name: 'roomId', description: 'Room identifier' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Room details retrieved' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Room not found' }),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PumpRoomsController.prototype, "getRoom", null);
__decorate([
    (0, common_1.Get)(':roomId/voting-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Get voting data and statistics for a room' }),
    (0, swagger_1.ApiParam)({ name: 'roomId', description: 'Room identifier' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Voting data retrieved' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Room not found' }),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PumpRoomsController.prototype, "getVotingData", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active pump rooms' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Active rooms retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PumpRoomsController.prototype, "getActiveRooms", null);
exports.PumpRoomsController = PumpRoomsController = __decorate([
    (0, swagger_1.ApiTags)('pump-rooms'),
    (0, common_1.Controller)('pump-rooms'),
    __metadata("design:paramtypes", [pump_rooms_service_1.PumpRoomsService])
], PumpRoomsController);
//# sourceMappingURL=pump-rooms.controller.js.map