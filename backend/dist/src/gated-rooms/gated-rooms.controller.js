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
var GatedRoomsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatedRoomsController = void 0;
const common_1 = require("@nestjs/common");
const gated_rooms_service_1 = require("./gated-rooms.service");
const create_gated_room_dto_1 = require("./dto/create-gated-room.dto");
const check_access_dto_1 = require("./dto/check-access.dto");
let GatedRoomsController = GatedRoomsController_1 = class GatedRoomsController {
    gatedRoomsService;
    logger = new common_1.Logger(GatedRoomsController_1.name);
    constructor(gatedRoomsService) {
        this.gatedRoomsService = gatedRoomsService;
    }
    async create(createGatedRoomDto) {
        try {
            this.logger.log(`Creating gated room: ${createGatedRoomDto.roomId}`);
            const gatedRoom = await this.gatedRoomsService.createGatedRoom(createGatedRoomDto);
            return {
                success: true,
                data: gatedRoom,
                message: 'Gated room created successfully',
            };
        }
        catch (error) {
            this.logger.error(`Error creating gated room: ${error.message}`);
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to create gated room',
                error: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const gatedRooms = await this.gatedRoomsService.findAll();
            return {
                success: true,
                data: gatedRooms,
                count: gatedRooms.length,
            };
        }
        catch (error) {
            this.logger.error(`Error fetching gated rooms: ${error.message}`);
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to fetch gated rooms',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async checkAccess(checkAccessDto) {
        try {
            this.logger.log(`Checking access for room ${checkAccessDto.roomId} and account ${checkAccessDto.stellarAccountId}`);
            const accessStatus = await this.gatedRoomsService.checkAccess(checkAccessDto);
            this.logger.log(`Access check result: ${accessStatus.hasAccess ? 'GRANTED' : 'DENIED'}`);
            return accessStatus;
        }
        catch (error) {
            this.logger.error(`Error checking access: ${error.message}`);
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to check room access',
                error: error.message,
                hasAccess: false,
                roomId: checkAccessDto.roomId,
                stellarAccountId: checkAccessDto.stellarAccountId,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOne(id) {
        try {
            const gatedRoom = await this.gatedRoomsService.findOne(id);
            return {
                success: true,
                data: gatedRoom,
            };
        }
        catch (error) {
            this.logger.error(`Error fetching gated room ${id}: ${error.message}`);
            throw new common_1.HttpException({
                success: false,
                message: 'Gated room not found',
                error: error.message,
            }, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async remove(id) {
        try {
            await this.gatedRoomsService.deleteGatedRoom(id);
            return {
                success: true,
                message: 'Gated room deleted successfully',
            };
        }
        catch (error) {
            this.logger.error(`Error deleting gated room ${id}: ${error.message}`);
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to delete gated room',
                error: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.GatedRoomsController = GatedRoomsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_gated_room_dto_1.CreateGatedRoomDto]),
    __metadata("design:returntype", Promise)
], GatedRoomsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GatedRoomsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('check'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_access_dto_1.CheckAccessDto]),
    __metadata("design:returntype", Promise)
], GatedRoomsController.prototype, "checkAccess", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GatedRoomsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GatedRoomsController.prototype, "remove", null);
exports.GatedRoomsController = GatedRoomsController = GatedRoomsController_1 = __decorate([
    (0, common_1.Controller)('gated-rooms'),
    __metadata("design:paramtypes", [gated_rooms_service_1.GatedRoomsService])
], GatedRoomsController);
//# sourceMappingURL=gated-rooms.controller.js.map