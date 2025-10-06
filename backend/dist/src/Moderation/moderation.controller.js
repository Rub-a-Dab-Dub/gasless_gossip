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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationController = void 0;
const common_1 = require("@nestjs/common");
const moderation_service_1 = require("./moderation.service");
const moderation_action_dto_1 = require("./dto/moderation-action.dto");
let ModerationController = class ModerationController {
    moderationService;
    constructor(moderationService) {
        this.moderationService = moderationService;
    }
    async banUser(req, createDto) {
        const moderatorId = req.user?.id || 'mock-moderator-id';
        const banDto = { ...createDto, actionType: 'ban' };
        return await this.moderationService.createModerationAction(moderatorId, banDto);
    }
    async kickUser(req, createDto) {
        const moderatorId = req.user?.id || 'mock-moderator-id';
        const kickDto = { ...createDto, actionType: 'kick' };
        return await this.moderationService.createModerationAction(moderatorId, kickDto);
    }
    async muteUser(req, createDto) {
        const moderatorId = req.user?.id || 'mock-moderator-id';
        const muteDto = { ...createDto, actionType: 'mute' };
        return await this.moderationService.createModerationAction(moderatorId, muteDto);
    }
    async unbanUser(req, reverseDto) {
        const moderatorId = req.user?.id || 'mock-moderator-id';
        const unbanDto = { ...reverseDto, actionType: 'ban' };
        return await this.moderationService.reverseModerationAction(moderatorId, unbanDto);
    }
    async unmuteUser(req, reverseDto) {
        const moderatorId = req.user?.id || 'mock-moderator-id';
        const unmuteDto = { ...reverseDto, actionType: 'mute' };
        return await this.moderationService.reverseModerationAction(moderatorId, unmuteDto);
    }
    async warnUser(req, createDto) {
        const moderatorId = req.user?.id || 'mock-moderator-id';
        const warnDto = { ...createDto, actionType: 'warn' };
        return await this.moderationService.createModerationAction(moderatorId, warnDto);
    }
    async getModerationHistory(roomId, targetId) {
        return await this.moderationService.getModerationHistory(roomId, targetId);
    }
    async getActiveModerations(roomId) {
        return await this.moderationService.getActiveModerations(roomId);
    }
    async checkBanStatus(roomId, userId) {
        const isBanned = await this.moderationService.isUserBanned(userId, roomId);
        return { isBanned };
    }
    async checkMuteStatus(roomId, userId) {
        const isMuted = await this.moderationService.isUserMuted(userId, roomId);
        return { isMuted };
    }
};
exports.ModerationController = ModerationController;
__decorate([
    (0, common_1.Post)('ban'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, moderation_action_dto_1.CreateModerationActionDto]),
    __metadata("design:returntype", Promise)
], ModerationController.prototype, "banUser", null);
__decorate([
    (0, common_1.Post)('kick'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, moderation_action_dto_1.CreateModerationActionDto]),
    __metadata("design:returntype", Promise)
], ModerationController.prototype, "kickUser", null);
__decorate([
    (0, common_1.Post)('mute'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, moderation_action_dto_1.CreateModerationActionDto]),
    __metadata("design:returntype", Promise)
], ModerationController.prototype, "muteUser", null);
__decorate([
    (0, common_1.Post)('unban'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, moderation_action_dto_1.ReverseModerationActionDto]),
    __metadata("design:returntype", Promise)
], ModerationController.prototype, "unbanUser", null);
__decorate([
    (0, common_1.Post)('unmute'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, moderation_action_dto_1.ReverseModerationActionDto]),
    __metadata("design:returntype", Promise)
], ModerationController.prototype, "unmuteUser", null);
__decorate([
    (0, common_1.Post)('warn'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, moderation_action_dto_1.CreateModerationActionDto]),
    __metadata("design:returntype", Promise)
], ModerationController.prototype, "warnUser", null);
__decorate([
    (0, common_1.Get)('history/:roomId'),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Query)('targetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ModerationController.prototype, "getModerationHistory", null);
__decorate([
    (0, common_1.Get)('active/:roomId'),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModerationController.prototype, "getActiveModerations", null);
__decorate([
    (0, common_1.Get)('check-ban/:roomId/:userId'),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ModerationController.prototype, "checkBanStatus", null);
__decorate([
    (0, common_1.Get)('check-mute/:roomId/:userId'),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ModerationController.prototype, "checkMuteStatus", null);
exports.ModerationController = ModerationController = __decorate([
    (0, common_1.Controller)('moderation'),
    __metadata("design:paramtypes", [typeof (_a = typeof moderation_service_1.ModerationService !== "undefined" && moderation_service_1.ModerationService) === "function" ? _a : Object])
], ModerationController);
//# sourceMappingURL=moderation.controller.js.map