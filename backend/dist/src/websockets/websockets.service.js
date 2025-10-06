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
exports.WebSocketsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const websockets_entity_1 = require("./websockets.entity");
let WebSocketsService = class WebSocketsService {
    messageRepo;
    notificationRepo;
    constructor(messageRepo, notificationRepo) {
        this.messageRepo = messageRepo;
        this.notificationRepo = notificationRepo;
    }
    async handleChat(data, client) {
        const message = this.messageRepo.create({
            roomId: data.roomId,
            userId: data.userId,
            content: data.content,
        });
        await this.messageRepo.save(message);
        client.broadcast.to(data.roomId).emit('chat', message);
        return { status: 'sent', message };
    }
    async handleNotification(data, client) {
        const notification = this.notificationRepo.create({
            userId: data.userId,
            content: data.content,
        });
        await this.notificationRepo.save(notification);
        client.broadcast.emit('notification', notification);
        return { status: 'notified', notification };
    }
};
exports.WebSocketsService = WebSocketsService;
exports.WebSocketsService = WebSocketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(websockets_entity_1.Message)),
    __param(1, (0, typeorm_1.InjectRepository)(websockets_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], WebSocketsService);
//# sourceMappingURL=websockets.service.js.map