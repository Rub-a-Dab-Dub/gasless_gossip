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
exports.Participant = void 0;
const typeorm_1 = require("typeorm");
const room_entity_1 = require("./room.entity");
let Participant = class Participant {
    id;
    userId;
    pseudonym;
    roomId;
    messageCount;
    reactionCount;
    joinedAt;
    room;
};
exports.Participant = Participant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Participant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Participant.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Participant.prototype, "pseudonym", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Participant.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Participant.prototype, "messageCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Participant.prototype, "reactionCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Participant.prototype, "joinedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room, room => room.participants, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'roomId' }),
    __metadata("design:type", room_entity_1.Room)
], Participant.prototype, "room", void 0);
exports.Participant = Participant = __decorate([
    (0, typeorm_1.Entity)('participants')
], Participant);
//# sourceMappingURL=participant.entity.js.map