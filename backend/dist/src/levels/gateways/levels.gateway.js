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
var LevelsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let LevelsGateway = LevelsGateway_1 = class LevelsGateway {
    server;
    logger = new common_1.Logger(LevelsGateway_1.name);
    userSockets = new Map();
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        for (const [userId, socketId] of this.userSockets.entries()) {
            if (socketId === client.id) {
                this.userSockets.delete(userId);
                break;
            }
        }
    }
    handleJoinUserRoom(client, data) {
        const { userId } = data;
        client.join(`user:${userId}`);
        this.userSockets.set(userId, client.id);
        this.logger.log(`User ${userId} joined their room`);
        client.emit('joined-room', { userId, room: `user:${userId}` });
    }
    handleLevelUpEvent(event) {
        this.logger.log(`Broadcasting level up event for user ${event.userId}`);
        this.server.to(`user:${event.userId}`).emit('level-up', {
            userId: event.userId,
            previousLevel: event.previousLevel,
            newLevel: event.newLevel,
            totalXp: event.totalXp,
            badgesUnlocked: event.badgesUnlocked,
            timestamp: new Date(),
        });
        this.server.to('levels').emit('leaderboard-update', {
            userId: event.userId,
            newLevel: event.newLevel,
            totalXp: event.totalXp,
        });
    }
    handleXpGainedEvent(event) {
        this.logger.log(`Broadcasting XP gained event for user ${event.userId}`);
        this.server.to(`user:${event.userId}`).emit('xp-gained', {
            userId: event.userId,
            xpAmount: event.xpAmount,
            source: event.source,
            metadata: event.metadata,
            timestamp: new Date(),
        });
    }
    handleBadgeUnlockedEvent(event) {
        this.logger.log(`Broadcasting badge unlocked event for user ${event.userId}`);
        this.server.to(`user:${event.userId}`).emit('badge-unlocked', {
            userId: event.userId,
            badgeId: event.badgeId,
            level: event.level,
            stellarTransactionId: event.stellarTransactionId,
            timestamp: new Date(),
        });
    }
    async handleGetLevelStatus(client, data) {
        const { userId } = data;
        client.emit('level-status', {
            userId,
            timestamp: new Date(),
        });
    }
};
exports.LevelsGateway = LevelsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Function)
], LevelsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-user-room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", void 0)
], LevelsGateway.prototype, "handleJoinUserRoom", null);
__decorate([
    (0, event_emitter_1.OnEvent)('level.up'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], LevelsGateway.prototype, "handleLevelUpEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('xp.gained'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], LevelsGateway.prototype, "handleXpGainedEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('badge.unlocked'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], LevelsGateway.prototype, "handleBadgeUnlockedEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get-level-status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], LevelsGateway.prototype, "handleGetLevelStatus", null);
exports.LevelsGateway = LevelsGateway = LevelsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/levels',
        cors: {
            origin: '*',
        },
    })
], LevelsGateway);
//# sourceMappingURL=levels.gateway.js.map