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
var GossipGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GossipGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const gossip_service_1 = require("./services/gossip.service");
const gossip_dto_1 = require("./dto/gossip.dto");
let GossipGateway = GossipGateway_1 = class GossipGateway {
    gossipService;
    server;
    logger = new common_1.Logger(GossipGateway_1.name);
    connectedUsers = new Map();
    socketToUser = new Map();
    roomSubscriptions = new Map();
    performanceMetrics = {
        totalConnections: 0,
        activeConnections: 0,
        messagesProcessed: 0,
        averageLatency: 0,
    };
    constructor(gossipService) {
        this.gossipService = gossipService;
    }
    afterInit(server) {
        this.logger.log('GossipGateway initialized');
        setInterval(() => {
            this.logPerformanceMetrics();
        }, 30000);
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        this.performanceMetrics.totalConnections++;
        this.performanceMetrics.activeConnections++;
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.performanceMetrics.activeConnections--;
        const userId = this.socketToUser.get(client.id);
        if (userId) {
            const userSockets = this.connectedUsers.get(userId);
            if (userSockets) {
                userSockets.delete(client.id);
                if (userSockets.size === 0) {
                    this.connectedUsers.delete(userId);
                }
            }
            for (const [roomId, sockets] of this.roomSubscriptions.entries()) {
                sockets.delete(client.id);
                if (sockets.size === 0) {
                    this.roomSubscriptions.delete(roomId);
                }
            }
            this.socketToUser.delete(client.id);
        }
    }
    async handleAuthenticate(data, client) {
        try {
            const userId = data.userId;
            if (!this.connectedUsers.has(userId)) {
                this.connectedUsers.set(userId, new Set());
            }
            this.connectedUsers.get(userId).add(client.id);
            this.socketToUser.set(client.id, userId);
            client.join(`user:${userId}`);
            this.logger.log(`User ${userId} authenticated with socket ${client.id}`);
            return { status: 'authenticated', userId };
        }
        catch (error) {
            this.logger.error('Authentication failed:', error);
            return { status: 'error', message: 'Authentication failed' };
        }
    }
    async handleJoinRoom(data, client) {
        const userId = this.socketToUser.get(client.id);
        if (!userId) {
            return { status: 'error', message: 'Not authenticated' };
        }
        const roomId = data.roomId;
        client.join(`room:${roomId}`);
        if (!this.roomSubscriptions.has(roomId)) {
            this.roomSubscriptions.set(roomId, new Set());
        }
        this.roomSubscriptions.get(roomId).add(client.id);
        this.logger.log(`User ${userId} joined room ${roomId}`);
        return { status: 'joined', roomId };
    }
    async handleLeaveRoom(data, client) {
        const userId = this.socketToUser.get(client.id);
        if (!userId) {
            return { status: 'error', message: 'Not authenticated' };
        }
        const roomId = data.roomId;
        client.leave(`room:${roomId}`);
        const roomSockets = this.roomSubscriptions.get(roomId);
        if (roomSockets) {
            roomSockets.delete(client.id);
            if (roomSockets.size === 0) {
                this.roomSubscriptions.delete(roomId);
            }
        }
        this.logger.log(`User ${userId} left room ${roomId}`);
        return { status: 'left', roomId };
    }
    async handleNewGossip(data, client) {
        const startTime = Date.now();
        const userId = this.socketToUser.get(client.id);
        if (!userId) {
            return { status: 'error', message: 'Not authenticated' };
        }
        try {
            const intent = await this.gossipService.createIntent(data, userId);
            const broadcast = {
                type: 'new_intent',
                intent,
                timestamp: new Date().toISOString(),
                roomId: data.roomId,
            };
            this.server.to(`room:${data.roomId}`).emit('gossip_update', broadcast);
            const latency = Date.now() - startTime;
            this.updatePerformanceMetrics(latency);
            this.logger.log(`New gossip created by ${userId} in room ${data.roomId} (${latency}ms)`);
            return { status: 'success', intent };
        }
        catch (error) {
            this.logger.error('Failed to create gossip:', error);
            return { status: 'error', message: 'Failed to create gossip' };
        }
    }
    async handleUpdateGossip(data, client) {
        const startTime = Date.now();
        const userId = this.socketToUser.get(client.id);
        if (!userId) {
            return { status: 'error', message: 'Not authenticated' };
        }
        try {
            const intent = await this.gossipService.updateIntentStatus(data, userId);
            const broadcast = {
                type: 'status_change',
                intent,
                timestamp: new Date().toISOString(),
                roomId: intent.roomId,
            };
            this.server.to(`room:${intent.roomId}`).emit('gossip_update', broadcast);
            const latency = Date.now() - startTime;
            this.updatePerformanceMetrics(latency);
            this.logger.log(`Gossip updated by ${userId} (${latency}ms)`);
            return { status: 'success', intent };
        }
        catch (error) {
            this.logger.error('Failed to update gossip:', error);
            return { status: 'error', message: 'Failed to update gossip' };
        }
    }
    async handleVoteGossip(data, client) {
        const startTime = Date.now();
        const userId = this.socketToUser.get(client.id);
        if (!userId) {
            return { status: 'error', message: 'Not authenticated' };
        }
        try {
            const intent = await this.gossipService.voteIntent(data, userId);
            const broadcast = {
                type: 'vote',
                intent,
                timestamp: new Date().toISOString(),
                roomId: intent.roomId,
            };
            this.server.to(`room:${intent.roomId}`).emit('gossip_update', broadcast);
            const latency = Date.now() - startTime;
            this.updatePerformanceMetrics(latency);
            this.logger.log(`Gossip voted by ${userId} (${latency}ms)`);
            return { status: 'success', intent };
        }
        catch (error) {
            this.logger.error('Failed to vote gossip:', error);
            return { status: 'error', message: 'Failed to vote gossip' };
        }
    }
    async handleCommentGossip(data, client) {
        const startTime = Date.now();
        const userId = this.socketToUser.get(client.id);
        if (!userId) {
            return { status: 'error', message: 'Not authenticated' };
        }
        try {
            const update = await this.gossipService.commentIntent(data, userId);
            const intent = await this.gossipService.getIntentById(data.intentId);
            const broadcast = {
                type: 'comment',
                intent,
                update,
                timestamp: new Date().toISOString(),
                roomId: intent.roomId,
            };
            this.server.to(`room:${intent.roomId}`).emit('gossip_update', broadcast);
            const latency = Date.now() - startTime;
            this.updatePerformanceMetrics(latency);
            this.logger.log(`Gossip commented by ${userId} (${latency}ms)`);
            return { status: 'success', update };
        }
        catch (error) {
            this.logger.error('Failed to comment gossip:', error);
            return { status: 'error', message: 'Failed to comment gossip' };
        }
    }
    async broadcastToRoom(roomId, event, data) {
        this.server.to(`room:${roomId}`).emit(event, data);
    }
    async broadcastToUser(userId, event, data) {
        this.server.to(`user:${userId}`).emit(event, data);
    }
    async broadcastToAll(event, data) {
        this.server.emit(event, data);
    }
    updatePerformanceMetrics(latency) {
        this.performanceMetrics.messagesProcessed++;
        this.performanceMetrics.averageLatency =
            (this.performanceMetrics.averageLatency + latency) / 2;
    }
    logPerformanceMetrics() {
        this.logger.log(`Performance Metrics:
      Active Connections: ${this.performanceMetrics.activeConnections}
      Total Connections: ${this.performanceMetrics.totalConnections}
      Messages Processed: ${this.performanceMetrics.messagesProcessed}
      Average Latency: ${this.performanceMetrics.averageLatency.toFixed(2)}ms
      Rooms with Subscribers: ${this.roomSubscriptions.size}
      Users Connected: ${this.connectedUsers.size}`);
    }
    getConnectionStats() {
        return {
            activeConnections: this.performanceMetrics.activeConnections,
            totalConnections: this.performanceMetrics.totalConnections,
            roomsSubscribed: this.roomSubscriptions.size,
            usersConnected: this.connectedUsers.size,
            averageLatency: this.performanceMetrics.averageLatency,
        };
    }
};
exports.GossipGateway = GossipGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GossipGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('authenticate'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GossipGateway.prototype, "handleAuthenticate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GossipGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GossipGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('new_gossip'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gossip_dto_1.CreateGossipIntentDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GossipGateway.prototype, "handleNewGossip", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('update_gossip'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gossip_dto_1.UpdateGossipIntentDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GossipGateway.prototype, "handleUpdateGossip", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('vote_gossip'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gossip_dto_1.VoteGossipDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GossipGateway.prototype, "handleVoteGossip", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('comment_gossip'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gossip_dto_1.CommentGossipDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GossipGateway.prototype, "handleCommentGossip", null);
exports.GossipGateway = GossipGateway = GossipGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/gossip',
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    }),
    __metadata("design:paramtypes", [gossip_service_1.GossipService])
], GossipGateway);
//# sourceMappingURL=gossip.gateway.js.map