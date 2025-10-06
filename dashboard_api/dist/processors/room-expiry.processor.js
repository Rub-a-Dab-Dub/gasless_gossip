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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomExpiryProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const bull_2 = require("bull");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("../entities/room.entity");
let RoomExpiryProcessor = class RoomExpiryProcessor {
    roomRepo;
    constructor(roomRepo) {
        this.roomRepo = roomRepo;
    }
    async handleExpiry(job) {
        const { roomId } = job.data;
        const room = await this.roomRepo.findOne({ where: { id: roomId } });
        if (room && room.expiresAt && new Date() >= room.expiresAt) {
            await this.roomRepo.remove(room);
            console.log(`Room ${roomId} expired and deleted`);
        }
    }
};
exports.RoomExpiryProcessor = RoomExpiryProcessor;
__decorate([
    (0, bull_1.Process)('expire-room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof bull_2.Job !== "undefined" && bull_2.Job) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], RoomExpiryProcessor.prototype, "handleExpiry", null);
exports.RoomExpiryProcessor = RoomExpiryProcessor = __decorate([
    (0, bull_1.Processor)('room-expiry'),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RoomExpiryProcessor);
//# sourceMappingURL=room-expiry.processor.js.map