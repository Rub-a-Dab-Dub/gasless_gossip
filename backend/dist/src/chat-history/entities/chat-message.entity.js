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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
const typeorm_1 = require("typeorm");
let ChatMessage = class ChatMessage {
    id;
    roomId;
    senderId;
    content;
    messageType;
    metadata;
    createdAt;
};
exports.ChatMessage = ChatMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChatMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ChatMessage.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ChatMessage.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ChatMessage.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ChatMessage.prototype, "messageType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ChatMessage.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ChatMessage.prototype, "createdAt", void 0);
exports.ChatMessage = ChatMessage = __decorate([
    (0, typeorm_1.Entity)('chat_messages'),
    (0, typeorm_1.Index)(['roomId', 'createdAt']),
    (0, typeorm_1.Index)(['senderId', 'createdAt']),
    (0, typeorm_1.Index)(['roomId']),
    (0, typeorm_1.Index)(['senderId'])
], ChatMessage);
//# sourceMappingURL=chat-message.entity.js.map