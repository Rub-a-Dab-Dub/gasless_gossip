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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomEventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
let RoomEventsGateway = class RoomEventsGateway {
    server;
    redisSubscriber;
    redisPublisher;
    afterInit() {
        this.redisSubscriber = new ioredis_1.default({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT) || 6379,
        });
        this.redisPublisher = new ioredis_1.default({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT) || 6379,
        });
        this.redisSubscriber.subscribe('room-updates');
        this.redisSubscriber.on('message', (channel, message) => {
            if (channel === 'room-updates') {
                const data = JSON.parse(message);
                this.server.to(data.roomId).emit('room-update', data);
            }
        });
    }
    async publishRoomUpdate(roomId, event, data) {
        await this.redisPublisher.publish('room-updates', JSON.stringify({
            roomId,
            event,
            data,
            timestamp: new Date().toISOString(),
        }));
    }
    async notifyParticipants(roomId, message) {
        this.server.to(roomId).emit('notification', { message });
    }
};
exports.RoomEventsGateway = RoomEventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RoomEventsGateway.prototype, "server", void 0);
exports.RoomEventsGateway = RoomEventsGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({ namespace: '/rooms' })
], RoomEventsGateway);
//# sourceMappingURL=room-events.gateway.js.map