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
exports.SecretRoomsController = void 0;
const common_1 = require("@nestjs/common");
const secret_rooms_service_1 = require("./services/secret-rooms.service");
const secret_room_dto_1 = require("./dto/secret-room.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const throttler_1 = require("@nestjs/throttler");
let SecretRoomsController = class SecretRoomsController {
    secretRoomsService;
    constructor(secretRoomsService) {
        this.secretRoomsService = secretRoomsService;
    }
    async createSecretRoom(dto, req) {
        return this.secretRoomsService.createSecretRoom(dto, req.user.id);
    }
    async getSecretRoom(id, req) {
        return this.secretRoomsService.getSecretRoom(id, req.user.id);
    }
    async getSecretRoomByCode(roomCode, req) {
        return this.secretRoomsService.getSecretRoomByCode(roomCode, req.user.id);
    }
    async getUserRooms(limit, req) {
        return this.secretRoomsService.getUserRooms(req.user.id, limit || 20);
    }
    async joinRoom(dto, req) {
        return this.secretRoomsService.joinRoom(dto, req.user.id);
    }
    async leaveRoom(id, req) {
        await this.secretRoomsService.leaveRoom(id, req.user.id);
        return { message: 'Successfully left the room' };
    }
    async inviteUser(id, dto, req) {
        return this.secretRoomsService.inviteUser(id, dto, req.user.id);
    }
    async acceptInvitation(body, req) {
        return this.secretRoomsService.acceptInvitation(body.invitationCode, req.user.id);
    }
    async getRoomMembers(id, req) {
        return this.secretRoomsService.getRoomMembers(id, req.user.id);
    }
    async updateRoom(id, dto, req) {
        return this.secretRoomsService.updateRoom(id, dto, req.user.id);
    }
    async deleteRoom(id, req) {
        await this.secretRoomsService.deleteRoom(id, req.user.id);
        return { message: 'Room deleted successfully' };
    }
    async getRoomStats() {
        return this.secretRoomsService.getRoomStats();
    }
    async getUserRoomLimit(req) {
        return this.secretRoomsService.getUserRoomLimit(req.user.id);
    }
    async testConcurrentRoomCreation(rooms = 10, req) {
        const startTime = Date.now();
        const roomPromises = Array.from({ length: rooms }, (_, i) => this.secretRoomsService.createSecretRoom({
            name: `Test Room ${i + 1}`,
            description: `Performance test room ${i + 1}`,
            isPrivate: i % 2 === 0,
            maxUsers: 50,
            category: 'test',
            theme: 'dark',
            settings: {
                allowAnonymous: true,
                requireApproval: false,
                autoDelete: false,
                moderationLevel: 'low',
            },
            metadata: {
                tags: ['test', 'performance'],
                language: 'en',
            },
        }, req.user.id));
        const results = await Promise.all(roomPromises);
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        return {
            message: 'Concurrent room creation test completed',
            totalRooms: rooms,
            totalTime: `${totalTime}ms`,
            averageTime: `${(totalTime / rooms).toFixed(2)}ms`,
            roomsPerSecond: `${(rooms / (totalTime / 1000)).toFixed(2)}`,
            results,
        };
    }
    async testPerformance(operations = 100, req) {
        const startTime = Date.now();
        const roomCreationStart = Date.now();
        const testRoom = await this.secretRoomsService.createSecretRoom({
            name: 'Performance Test Room',
            description: 'Room for performance testing',
            isPrivate: false,
            maxUsers: 100,
            category: 'test',
        }, req.user.id);
        const roomCreationTime = Date.now() - roomCreationStart;
        const roomRetrievalStart = Date.now();
        await this.secretRoomsService.getSecretRoom(testRoom.id, req.user.id);
        const roomRetrievalTime = Date.now() - roomRetrievalStart;
        const memberJoinStart = Date.now();
        await this.secretRoomsService.joinRoom({
            roomCode: testRoom.roomCode,
            nickname: 'Test User',
            isAnonymous: false,
        }, req.user.id);
        const memberJoinTime = Date.now() - memberJoinStart;
        const roomUpdateStart = Date.now();
        await this.secretRoomsService.updateRoom(testRoom.id, {
            name: 'Updated Performance Test Room',
            description: 'Updated description',
        }, req.user.id);
        const roomUpdateTime = Date.now() - roomUpdateStart;
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        return {
            message: 'Performance test completed',
            operations: 4,
            totalTime: `${totalTime}ms`,
            averageTime: `${(totalTime / 4).toFixed(2)}ms`,
            operationsPerSecond: `${(4 / (totalTime / 1000)).toFixed(2)}`,
            performance: {
                roomCreation: `${roomCreationTime}ms`,
                roomRetrieval: `${roomRetrievalTime}ms`,
                memberJoin: `${memberJoinTime}ms`,
                roomUpdate: `${roomUpdateTime}ms`,
            },
        };
    }
};
exports.SecretRoomsController = SecretRoomsController;
__decorate([
    (0, common_1.Post)('create'),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [secret_room_dto_1.CreateSecretRoomDto, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "createSecretRoom", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, throttler_1.Throttle)({ short: { limit: 30, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "getSecretRoom", null);
__decorate([
    (0, common_1.Get)('code/:roomCode'),
    (0, throttler_1.Throttle)({ short: { limit: 30, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('roomCode')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "getSecretRoomByCode", null);
__decorate([
    (0, common_1.Get)('user/rooms'),
    (0, throttler_1.Throttle)({ short: { limit: 20, ttl: 60000 } }),
    __param(0, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "getUserRooms", null);
__decorate([
    (0, common_1.Post)('join'),
    (0, throttler_1.Throttle)({ short: { limit: 20, ttl: 60000 } }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [secret_room_dto_1.JoinRoomDto, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "joinRoom", null);
__decorate([
    (0, common_1.Post)(':id/leave'),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "leaveRoom", null);
__decorate([
    (0, common_1.Post)(':id/invite'),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, secret_room_dto_1.InviteUserDto, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "inviteUser", null);
__decorate([
    (0, common_1.Post)('invite/accept'),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "acceptInvitation", null);
__decorate([
    (0, common_1.Get)(':id/members'),
    (0, throttler_1.Throttle)({ short: { limit: 20, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "getRoomMembers", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, throttler_1.Throttle)({ short: { limit: 5, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, secret_room_dto_1.UpdateSecretRoomDto, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "updateRoom", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, throttler_1.Throttle)({ short: { limit: 5, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "deleteRoom", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "getRoomStats", null);
__decorate([
    (0, common_1.Get)('user/limit'),
    (0, throttler_1.Throttle)({ short: { limit: 20, ttl: 60000 } }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "getUserRoomLimit", null);
__decorate([
    (0, common_1.Post)('test/concurrent-creation'),
    (0, throttler_1.Throttle)({ short: { limit: 1, ttl: 60000 } }),
    __param(0, (0, common_1.Query)('rooms', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "testConcurrentRoomCreation", null);
__decorate([
    (0, common_1.Get)('test/performance'),
    (0, throttler_1.Throttle)({ short: { limit: 1, ttl: 60000 } }),
    __param(0, (0, common_1.Query)('operations', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "testPerformance", null);
exports.SecretRoomsController = SecretRoomsController = __decorate([
    (0, common_1.Controller)('rooms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [secret_rooms_service_1.SecretRoomsService])
], SecretRoomsController);
//# sourceMappingURL=secret-rooms.controller.js.map