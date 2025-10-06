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
var HooksGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HooksGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let HooksGateway = HooksGateway_1 = class HooksGateway {
    server;
    logger = new common_1.Logger(HooksGateway_1.name);
    connectedClients = new Map();
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        this.connectedClients.set(client.id, client);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.connectedClients.delete(client.id);
    }
    handleSubscribeToEvents(data, client) {
        const { eventTypes } = data;
        if (eventTypes && eventTypes.length > 0) {
            eventTypes.forEach(eventType => {
                client.join(`event:${eventType}`);
            });
            this.logger.log(`Client ${client.id} subscribed to events: ${eventTypes.join(', ')}`);
        }
        else {
            client.join('all-events');
            this.logger.log(`Client ${client.id} subscribed to all events`);
        }
        client.emit('subscription-confirmed', { eventTypes: eventTypes || ['all'] });
    }
    handleUnsubscribeFromEvents(data, client) {
        const { eventTypes } = data;
        if (eventTypes && eventTypes.length > 0) {
            eventTypes.forEach(eventType => {
                client.leave(`event:${eventType}`);
            });
        }
        else {
            client.leave('all-events');
        }
        client.emit('unsubscription-confirmed', { eventTypes: eventTypes || ['all'] });
    }
    broadcastHookCreated(hook) {
        try {
            this.server.to(`event:${hook.eventType}`).emit('hook-created', {
                id: hook.id,
                eventType: hook.eventType,
                data: hook.data,
                stellarTransactionId: hook.stellarTransactionId,
                stellarAccountId: hook.stellarAccountId,
                createdAt: hook.createdAt,
            });
            this.server.to('all-events').emit('hook-created', {
                id: hook.id,
                eventType: hook.eventType,
                data: hook.data,
                stellarTransactionId: hook.stellarTransactionId,
                stellarAccountId: hook.stellarAccountId,
                createdAt: hook.createdAt,
            });
            this.logger.log(`Broadcasted hook created: ${hook.id} (${hook.eventType})`);
        }
        catch (error) {
            this.logger.error(`Failed to broadcast hook created: ${error.message}`);
        }
    }
    broadcastHookProcessed(hook) {
        try {
            const updateData = {
                id: hook.id,
                eventType: hook.eventType,
                processed: hook.processed,
                processedAt: hook.processedAt,
                errorMessage: hook.errorMessage,
            };
            this.server.to(`event:${hook.eventType}`).emit('hook-processed', updateData);
            this.server.to('all-events').emit('hook-processed', updateData);
            this.logger.log(`Broadcasted hook processed: ${hook.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to broadcast hook processed: ${error.message}`);
        }
    }
    broadcastStats(stats) {
        try {
            this.server.to('all-events').emit('hooks-stats', stats);
        }
        catch (error) {
            this.logger.error(`Failed to broadcast stats: ${error.message}`);
        }
    }
    getConnectedClientsCount() {
        return this.connectedClients.size;
    }
};
exports.HooksGateway = HooksGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], HooksGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe-to-events'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], HooksGateway.prototype, "handleSubscribeToEvents", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe-from-events'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], HooksGateway.prototype, "handleUnsubscribeFromEvents", null);
exports.HooksGateway = HooksGateway = HooksGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            credentials: true,
        },
        namespace: '/hooks',
    })
], HooksGateway);
//# sourceMappingURL=hooks.gateway.js.map