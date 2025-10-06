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
var SecretRoomsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretRoomsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const fake_name_generator_service_1 = require("../services/fake-name-generator.service");
const voice_moderation_queue_service_1 = require("../services/voice-moderation-queue.service");
let SecretRoomsGateway = SecretRoomsGateway_1 = class SecretRoomsGateway {
    fakeNameGenerator;
    voiceModerationQueue;
    server;
    logger = new common_1.Logger(SecretRoomsGateway_1.name);
    connectedUsers = new Map();
    roomParticipants = new Map();
    constructor(fakeNameGenerator, voiceModerationQueue) {
        this.fakeNameGenerator = fakeNameGenerator;
        this.voiceModerationQueue = voiceModerationQueue;
    }
    async handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    async handleDisconnect(client) {
        const user = this.connectedUsers.get(client.id);
        if (user) {
            const roomParticipants = this.roomParticipants.get(user.roomId);
            if (roomParticipants) {
                roomParticipants.delete(client.id);
                if (roomParticipants.size === 0) {
                    this.roomParticipants.delete(user.roomId);
                }
            }
            if (user.pseudonym) {
                this.fakeNameGenerator.releaseFakeName(user.pseudonym, user.roomId);
            }
            client.to(user.roomId).emit('userLeft', {
                pseudonym: user.pseudonym,
                timestamp: new Date(),
            });
            this.connectedUsers.delete(client.id);
            this.logger.log(`User disconnected: ${client.id} from room: ${user.roomId}`);
        }
    }
    async handleJoinRoom(client, data) {
        try {
            const { roomId, userId, enablePseudonym = true, fakeNameTheme = 'default' } = data;
            let pseudonym;
            if (enablePseudonym) {
                pseudonym = this.fakeNameGenerator.generateFakeName(fakeNameTheme, roomId);
            }
            const user = {
                userId,
                roomId,
                pseudonym,
                joinedAt: new Date(),
            };
            this.connectedUsers.set(client.id, user);
            if (!this.roomParticipants.has(roomId)) {
                this.roomParticipants.set(roomId, new Set());
            }
            this.roomParticipants.get(roomId).add(client.id);
            await client.join(roomId);
            client.to(roomId).emit('userJoined', {
                pseudonym,
                timestamp: new Date(),
            });
            client.emit('joinedRoom', {
                roomId,
                pseudonym,
                participantCount: this.roomParticipants.get(roomId)?.size || 0,
            });
            this.logger.log(`User ${userId} joined room ${roomId} as ${pseudonym || 'themselves'}`);
        }
        catch (error) {
            this.logger.error('Error joining room:', error);
            client.emit('error', { message: 'Failed to join room' });
        }
    }
    async handleLeaveRoom(client) {
        const user = this.connectedUsers.get(client.id);
        if (user) {
            await client.leave(user.roomId);
            await this.handleDisconnect(client);
        }
    }
    async handleReaction(client, data) {
        try {
            const user = this.connectedUsers.get(client.id);
            if (!user || user.roomId !== data.roomId) {
                client.emit('error', { message: 'Not authorized for this room' });
                return;
            }
            const reactionEvent = {
                ...data,
                pseudonym: user.pseudonym,
                timestamp: new Date(),
            };
            this.server.to(data.roomId).emit('reactionAdded', reactionEvent);
            this.logger.debug(`Reaction sent: ${data.emoji} by ${user.pseudonym || user.userId} in room ${data.roomId}`);
        }
        catch (error) {
            this.logger.error('Error handling reaction:', error);
            client.emit('error', { message: 'Failed to send reaction' });
        }
    }
    async handleVoiceNote(client, data) {
        try {
            const user = this.connectedUsers.get(client.id);
            if (!user || user.roomId !== data.roomId) {
                client.emit('error', { message: 'Not authorized for this room' });
                return;
            }
            const queuePosition = await this.voiceModerationQueue.addToQueue({
                roomId: data.roomId,
                userId: user.userId,
                voiceNoteUrl: data.voiceNoteUrl,
                priority: 'medium'
            });
            client.emit('voiceNoteQueued', {
                queuePosition,
                estimatedWaitTime: queuePosition * 30,
            });
            const voiceNoteEvent = {
                ...data,
                pseudonym: user.pseudonym,
                timestamp: new Date(),
            };
            this.server.to(data.roomId).emit('voiceNoteReceived', voiceNoteEvent);
            this.logger.debug(`Voice note queued: ${user.pseudonym || user.userId} in room ${data.roomId}`);
        }
        catch (error) {
            this.logger.error('Error handling voice note:', error);
            client.emit('error', { message: 'Failed to send voice note' });
        }
    }
    async handleTokenTip(client, data) {
        try {
            const user = this.connectedUsers.get(client.id);
            if (!user || user.roomId !== data.roomId || user.userId !== data.fromUserId) {
                client.emit('error', { message: 'Not authorized for this action' });
                return;
            }
            const recipientSocket = Array.from(this.connectedUsers.entries())
                .find(([_, connectedUser]) => connectedUser.userId === data.toUserId && connectedUser.roomId === data.roomId);
            const tokenTipEvent = {
                ...data,
                fromPseudonym: user.pseudonym,
                toPseudonym: recipientSocket?.[1].pseudonym,
                timestamp: new Date(),
            };
            this.server.to(data.roomId).emit('tokenTipReceived', tokenTipEvent);
            client.emit('tokenTipSent', {
                amount: data.amount,
                token: data.token,
                recipient: tokenTipEvent.toPseudonym || 'User',
            });
            if (recipientSocket) {
                this.server.to(recipientSocket[0]).emit('tokenTipReceived', {
                    amount: data.amount,
                    token: data.token,
                    sender: user.pseudonym || 'User',
                    message: data.message,
                });
            }
            this.logger.log(`Token tip: ${data.amount} ${data.token} from ${user.pseudonym} to ${tokenTipEvent.toPseudonym} in room ${data.roomId}`);
        }
        catch (error) {
            this.logger.error('Error handling token tip:', error);
            client.emit('error', { message: 'Failed to send token tip' });
        }
    }
    async handleGetRoomStats(client, data) {
        const participants = this.roomParticipants.get(data.roomId);
        const moderationQueue = this.voiceModerationQueue.getItemsByRoom(data.roomId);
        client.emit('roomStats', {
            participantCount: participants?.size || 0,
            moderationQueueLength: moderationQueue.length,
            timestamp: new Date(),
        });
    }
    broadcastToRoom(roomId, event, data) {
        this.server.to(roomId).emit(event, data);
    }
    getRoomParticipantCount(roomId) {
        return this.roomParticipants.get(roomId)?.size || 0;
    }
    getRoomParticipants(roomId) {
        const participants = this.roomParticipants.get(roomId);
        if (!participants)
            return [];
        return Array.from(participants)
            .map(socketId => this.connectedUsers.get(socketId))
            .filter((user) => user !== undefined && user.roomId === roomId);
    }
};
exports.SecretRoomsGateway = SecretRoomsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SecretRoomsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SecretRoomsGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendReaction'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsGateway.prototype, "handleReaction", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendVoiceNote'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsGateway.prototype, "handleVoiceNote", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendTokenTip'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsGateway.prototype, "handleTokenTip", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getRoomStats'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], SecretRoomsGateway.prototype, "handleGetRoomStats", null);
exports.SecretRoomsGateway = SecretRoomsGateway = SecretRoomsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
        namespace: '/rooms',
    }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [fake_name_generator_service_1.FakeNameGeneratorService,
        voice_moderation_queue_service_1.VoiceModerationQueueService])
], SecretRoomsGateway);
//# sourceMappingURL=secret-rooms.gateway.js.map