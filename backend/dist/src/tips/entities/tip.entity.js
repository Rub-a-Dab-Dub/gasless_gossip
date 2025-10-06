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
exports.Tip = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let Tip = class Tip {
    id;
    amount;
    receiverId;
    senderId;
    txId;
    createdAt;
    receiver;
    sender;
};
exports.Tip = Tip;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Tip.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 7 }),
    __metadata("design:type", Number)
], Tip.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receiver_id' }),
    __metadata("design:type", String)
], Tip.prototype, "receiverId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sender_id' }),
    __metadata("design:type", String)
], Tip.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tx_id', unique: true }),
    __metadata("design:type", String)
], Tip.prototype, "txId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Tip.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'receiver_id' }),
    __metadata("design:type", user_entity_1.User)
], Tip.prototype, "receiver", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'sender_id' }),
    __metadata("design:type", user_entity_1.User)
], Tip.prototype, "sender", void 0);
exports.Tip = Tip = __decorate([
    (0, typeorm_1.Entity)('tips')
], Tip);
//# sourceMappingURL=tip.entity.js.map