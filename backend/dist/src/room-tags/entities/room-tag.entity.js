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
exports.RoomTag = void 0;
const typeorm_1 = require("typeorm");
const room_entity_1 = require("../../rooms/entities/room.entity");
let RoomTag = class RoomTag {
    id;
    roomId;
    tagName;
    createdBy;
    room;
    createdAt;
};
exports.RoomTag = RoomTag;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RoomTag.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'room_id' }),
    __metadata("design:type", String)
], RoomTag.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tag_name', length: 50 }),
    __metadata("design:type", String)
], RoomTag.prototype, "tagName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by' }),
    __metadata("design:type", String)
], RoomTag.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'room_id' }),
    __metadata("design:type", room_entity_1.Room)
], RoomTag.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], RoomTag.prototype, "createdAt", void 0);
exports.RoomTag = RoomTag = __decorate([
    (0, typeorm_1.Entity)('room_tags'),
    (0, typeorm_1.Index)(['roomId', 'tagName'], { unique: true })
], RoomTag);
//# sourceMappingURL=room-tag.entity.js.map