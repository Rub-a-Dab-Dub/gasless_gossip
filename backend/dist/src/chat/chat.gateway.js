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
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const rooms_service_1 = require("../rooms/rooms.service");
const paymaster_service_1 = require("../services/paymaster.service");
const common_1 = require("@nestjs/common");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    roomsService;
    paymasterService;
    server;
    logger = new common_1.Logger(ChatGateway_1.name);
    constructor(roomsService, paymasterService) {
        this.roomsService = roomsService;
        this.paymasterService = paymasterService;
    }
    afterInit() {
        console.log('ChatGateway initialized');
    }
    handleConnection(client) {
        console.log('Client connected', client.id);
    }
    handleDisconnect(client) {
        console.log('Client disconnected', client.id);
    }
    async handleJoin(payload, client) {
        try {
            if (payload.userId) {
                const isMember = await this.isUserMemberOfRoom(payload.userId, payload.room);
                if (!isMember) {
                    client.emit('error', {
                        message: 'User is not a member of this room',
                    });
                    return;
                }
            }
            client.join(payload.room);
            client.emit('joined', { room: payload.room });
            client.to(payload.room).emit('user_connected', {
                userId: payload.userId,
                socketId: client.id,
            });
        }
        catch (error) {
            this.logger.error('Error joining room:', error);
            client.emit('error', { message: 'Failed to join room' });
        }
    }
    async handleLeave(payload, client) {
        client.leave(payload.room);
        client.emit('left', { room: payload.room });
        client.to(payload.room).emit('user_disconnected', {
            userId: payload.userId,
            socketId: client.id,
        });
    }
    async handleMessage(payload) {
        try {
            if (payload.userId) {
                const isMember = await this.isUserMemberOfRoom(payload.userId, payload.room);
                if (!isMember) {
                    return;
                }
            }
            console.log('📩 Message received from client:', payload.message);
            this.server.to(payload.room).emit('message', {
                ...payload.message,
                userId: payload.userId,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            this.logger.error('Error sending message:', error);
        }
    }
    async handleGaslessMessage(payload) {
        try {
            if (payload.userId) {
                const isMember = await this.isUserMemberOfRoom(payload.userId, payload.room);
                if (!isMember) {
                    return;
                }
            }
            const canSponsor = await this.paymasterService.canSponsor();
            if (!canSponsor) {
                this.logger.warn('Paymaster cannot sponsor transactions');
                return;
            }
            if (payload.privateKey) {
                try {
                    const smartAccount = await this.paymasterService.createSmartAccount(payload.privateKey);
                    const result = await this.paymasterService.sendGaslessChatMessage(smartAccount, JSON.stringify(payload.message), payload.room, payload.userId || 'anonymous');
                    if (result.success) {
                        this.logger.log(`Gasless chat message sent: ${result.txHash}`);
                        this.server.to(payload.room).emit('message', {
                            ...payload.message,
                            userId: payload.userId,
                            timestamp: new Date().toISOString(),
                            gasless: true,
                            txHash: result.txHash,
                            userOpHash: result.userOpHash,
                        });
                    }
                    else {
                        this.logger.error('Failed to send gasless message:', result.error);
                        this.server.to(payload.room).emit('message', {
                            ...payload.message,
                            userId: payload.userId,
                            timestamp: new Date().toISOString(),
                            gasless: false,
                            error: result.error,
                        });
                    }
                }
                catch (error) {
                    this.logger.error('Error in gasless message transaction:', error);
                    this.server.to(payload.room).emit('message', {
                        ...payload.message,
                        userId: payload.userId,
                        timestamp: new Date().toISOString(),
                        gasless: false,
                        error: 'Gasless transaction failed',
                    });
                }
            }
            else {
                this.server.to(payload.room).emit('message', {
                    ...payload.message,
                    userId: payload.userId,
                    timestamp: new Date().toISOString(),
                    gasless: false,
                });
            }
        }
        catch (error) {
            this.logger.error('Error sending gasless message:', error);
        }
    }
    async notifyRoomJoined(roomId, userId) {
        this.server.to(roomId).emit('member_joined', {
            roomId,
            userId,
            timestamp: new Date().toISOString(),
        });
    }
    async notifyRoomLeft(roomId, userId) {
        this.server.to(roomId).emit('member_left', {
            roomId,
            userId,
            timestamp: new Date().toISOString(),
        });
    }
    async isUserMemberOfRoom(userId, roomId) {
        try {
            const members = await this.roomsService.getRoomMembers(roomId);
            return members.some((membership) => membership.userId === userId && membership.isActive);
        }
        catch (error) {
            return true;
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeave", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('gasless-message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGaslessMessage", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService,
        paymaster_service_1.PaymasterService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map