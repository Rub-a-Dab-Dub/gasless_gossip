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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretRoomsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const rooms_service_1 = require("./services/rooms.service");
const fake_name_generator_service_1 = require("./services/fake-name-generator.service");
const voice_moderation_queue_service_1 = require("./services/voice-moderation-queue.service");
const room_scheduler_service_1 = require("./services/room-scheduler.service");
const secret_rooms_gateway_1 = require("./gateways/secret-rooms.gateway");
const secret_room_dto_1 = require("../dto/secret-room.dto");
let SecretRoomsController = class SecretRoomsController {
    roomsService;
    fakeNameGenerator;
    voiceModerationQueue;
    roomScheduler;
    secretRoomsGateway;
    constructor(roomsService, fakeNameGenerator, voiceModerationQueue, roomScheduler, secretRoomsGateway) {
        this.roomsService = roomsService;
        this.fakeNameGenerator = fakeNameGenerator;
        this.voiceModerationQueue = voiceModerationQueue;
        this.roomScheduler = roomScheduler;
        this.secretRoomsGateway = secretRoomsGateway;
    }
    async createSecretRoom(dto, req) {
        return this.roomsService.createEnhancedRoom(dto, req.user.id);
    }
    async getSecretRoom(id, req) {
        return this.roomsService.getEnhancedRoom(id, req.user.id);
    }
    async updateSecretRoom(id, dto, req) {
        return this.roomsService.updateEnhancedRoom(id, dto, req.user.id);
    }
    async deleteSecretRoom(id, req) {
        await this.roomsService.deleteEnhancedRoom(id, req.user.id);
    }
    async joinSecretRoom(id, dto, req) {
        return this.roomsService.joinEnhancedRoom(id, dto, req.user.id);
    }
    async leaveSecretRoom(id, req) {
        await this.roomsService.leaveEnhancedRoom(id, req.user.id);
    }
    async inviteUser(id, dto, req) {
        return this.roomsService.inviteUserToRoom(id, dto, req.user.id);
    }
    async sendTokenTip(id, dto, req) {
        const result = await this.roomsService.sendTokenTip(id, dto, req.user.id);
        this.secretRoomsGateway.broadcastToRoom(id, 'tokenTipSent', {
            fromUserId: req.user.id,
            toUserId: dto.recipientUserId,
            amount: dto.amount,
            token: dto.token,
            message: dto.message,
            timestamp: new Date(),
        });
        return result;
    }
    async addReaction(id, dto, req) {
        const result = await this.roomsService.addReaction(id, dto, req.user.id);
        this.secretRoomsGateway.broadcastToRoom(id, 'reactionAdded', {
            messageId: dto.messageId,
            emoji: dto.emoji,
            userId: req.user.id,
            timestamp: new Date(),
        });
        return result;
    }
    async submitVoiceNote(id, dto, req) {
        return this.roomsService.submitVoiceNote(id, dto, req.user.id);
    }
    async getRoomReactions(id, req) {
        return this.roomsService.getRoomReactionMetrics(id, req.user.id);
    }
    async moderateRoom(id, dto, req) {
        return this.roomsService.performModerationAction(id, dto, req.user.id);
    }
    async getRoomStats(id, req) {
        return this.roomsService.getRoomStats(id, req.user.id);
    }
    async getModerationQueueStatus(id, req) {
        const roomQueue = this.voiceModerationQueue.getItemsByRoom(id);
        const overallStatus = this.voiceModerationQueue.getQueueStatus();
        return {
            totalItems: roomQueue.length,
            pendingItems: roomQueue.filter(item => item.status === 'pending').length,
            processingItems: roomQueue.filter(item => item.status === 'processing').length,
            queueCapacity: overallStatus.queueCapacity,
            averageProcessingTime: overallStatus.averageProcessingTime,
            yourPosition: roomQueue.findIndex(item => item.userId === req.user.id) + 1 || undefined,
        };
    }
    async previewFakeNames(theme) {
        if (!this.fakeNameGenerator.isValidTheme(theme)) {
            throw new Error(`Invalid theme: ${theme}`);
        }
        const samples = Array.from({ length: 5 }, () => this.fakeNameGenerator.generateFakeName(theme));
        return {
            theme: theme,
            samples,
        };
    }
    async getFakeNameThemes() {
        return {
            themes: this.fakeNameGenerator.getAvailableThemes(),
        };
    }
    async getSchedulerStats(req) {
        return this.roomScheduler.getProcessingStats();
    }
    async manualCleanup(req) {
        return this.roomScheduler.manualCleanup();
    }
};
exports.SecretRoomsController = SecretRoomsController;
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new secret room with enhanced features' }),
    (0, swagger_1.ApiResponse)({ type: secret_room_dto_1.SecretRoomResponseDto }),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof secret_room_dto_1.CreateSecretRoomDto !== "undefined" && secret_room_dto_1.CreateSecretRoomDto) === "function" ? _f : Object, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "createSecretRoom", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get secret room details with user-specific data' }),
    (0, swagger_1.ApiResponse)({ type: secret_room_dto_1.SecretRoomResponseDto }),
    (0, throttler_1.Throttle)({ short: { limit: 30, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "getSecretRoom", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update secret room settings' }),
    (0, swagger_1.ApiResponse)({ type: secret_room_dto_1.SecretRoomResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_g = typeof secret_room_dto_1.UpdateSecretRoomDto !== "undefined" && secret_room_dto_1.UpdateSecretRoomDto) === "function" ? _g : Object, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "updateSecretRoom", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete or archive a secret room' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "deleteSecretRoom", null);
__decorate([
    (0, common_1.Post)(':id/join'),
    (0, swagger_1.ApiOperation)({ summary: 'Join a secret room using room code' }),
    (0, swagger_1.ApiResponse)({ type: secret_room_dto_1.SecretRoomResponseDto }),
    (0, throttler_1.Throttle)({ short: { limit: 20, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_h = typeof secret_room_dto_1.JoinRoomDto !== "undefined" && secret_room_dto_1.JoinRoomDto) === "function" ? _h : Object, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "joinSecretRoom", null);
__decorate([
    (0, common_1.Post)(':id/leave'),
    (0, swagger_1.ApiOperation)({ summary: 'Leave a secret room' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "leaveSecretRoom", null);
__decorate([
    (0, common_1.Post)(':id/invite'),
    (0, swagger_1.ApiOperation)({ summary: 'Invite a user to the secret room' }),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_j = typeof secret_room_dto_1.InviteUserDto !== "undefined" && secret_room_dto_1.InviteUserDto) === "function" ? _j : Object, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "inviteUser", null);
__decorate([
    (0, common_1.Post)(':id/tip'),
    (0, swagger_1.ApiOperation)({ summary: 'Send token tip to another user in the room' }),
    (0, throttler_1.Throttle)({ short: { limit: 5, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_k = typeof secret_room_dto_1.SendTokenTipDto !== "undefined" && secret_room_dto_1.SendTokenTipDto) === "function" ? _k : Object, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "sendTokenTip", null);
__decorate([
    (0, common_1.Post)(':id/react'),
    (0, swagger_1.ApiOperation)({ summary: 'Add reaction to a message in the room' }),
    (0, throttler_1.Throttle)({ short: { limit: 30, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_l = typeof secret_room_dto_1.RoomReactionDto !== "undefined" && secret_room_dto_1.RoomReactionDto) === "function" ? _l : Object, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "addReaction", null);
__decorate([
    (0, common_1.Post)(':id/voice-note'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit voice note for moderation' }),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_m = typeof secret_room_dto_1.VoiceNoteDto !== "undefined" && secret_room_dto_1.VoiceNoteDto) === "function" ? _m : Object, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "submitVoiceNote", null);
__decorate([
    (0, common_1.Get)(':id/reactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get room reaction metrics and trending data' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "getRoomReactions", null);
__decorate([
    (0, common_1.Post)(':id/moderate'),
    (0, swagger_1.ApiOperation)({ summary: 'Perform moderation action (moderators only)' }),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_o = typeof secret_room_dto_1.ModerationActionDto !== "undefined" && secret_room_dto_1.ModerationActionDto) === "function" ? _o : Object, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "moderateRoom", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive room statistics' }),
    (0, swagger_1.ApiResponse)({ type: secret_room_dto_1.RoomStatsDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "getRoomStats", null);
__decorate([
    (0, common_1.Get)(':id/moderation-queue'),
    (0, swagger_1.ApiOperation)({ summary: 'Get moderation queue status for the room' }),
    (0, swagger_1.ApiResponse)({ type: secret_room_dto_1.ModerationQueueStatusDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "getModerationQueueStatus", null);
__decorate([
    (0, common_1.Get)('fake-names/preview/:theme'),
    (0, swagger_1.ApiOperation)({ summary: 'Preview fake names for a specific theme' }),
    (0, swagger_1.ApiResponse)({ type: secret_room_dto_1.FakeNamePreviewDto }),
    __param(0, (0, common_1.Param)('theme')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "previewFakeNames", null);
__decorate([
    (0, common_1.Get)('fake-names/themes'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available fake name themes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "getFakeNameThemes", null);
__decorate([
    (0, common_1.Get)('scheduler/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get room scheduler statistics (admin only)' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "getSchedulerStats", null);
__decorate([
    (0, common_1.Post)('scheduler/manual-cleanup'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually trigger room cleanup (admin only)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsController.prototype, "manualCleanup", null);
exports.SecretRoomsController = SecretRoomsController = __decorate([
    (0, swagger_1.ApiTags)('secret-rooms'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('secret-rooms'),
    __metadata("design:paramtypes", [typeof (_a = typeof rooms_service_1.RoomsService !== "undefined" && rooms_service_1.RoomsService) === "function" ? _a : Object, typeof (_b = typeof fake_name_generator_service_1.FakeNameGeneratorService !== "undefined" && fake_name_generator_service_1.FakeNameGeneratorService) === "function" ? _b : Object, typeof (_c = typeof voice_moderation_queue_service_1.VoiceModerationQueueService !== "undefined" && voice_moderation_queue_service_1.VoiceModerationQueueService) === "function" ? _c : Object, typeof (_d = typeof room_scheduler_service_1.RoomSchedulerService !== "undefined" && room_scheduler_service_1.RoomSchedulerService) === "function" ? _d : Object, typeof (_e = typeof secret_rooms_gateway_1.SecretRoomsGateway !== "undefined" && secret_rooms_gateway_1.SecretRoomsGateway) === "function" ? _e : Object])
], SecretRoomsController);
//# sourceMappingURL=secret-rooms.controller.js.map