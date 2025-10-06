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
exports.RoomExpiryService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const bull_2 = require("bull");
let RoomExpiryService = class RoomExpiryService {
    expiryQueue;
    constructor(expiryQueue) {
        this.expiryQueue = expiryQueue;
    }
    async scheduleExpiry(roomId, expiresAt) {
        const delay = expiresAt.getTime() - Date.now();
        if (delay > 0) {
            await this.expiryQueue.add('expire-room', { roomId }, { delay });
        }
    }
    async cancelExpiry(roomId) {
        const jobs = await this.expiryQueue.getJobs(['delayed', 'waiting']);
        const job = jobs.find(j => j.data.roomId === roomId);
        if (job) {
            await job.remove();
        }
    }
};
exports.RoomExpiryService = RoomExpiryService;
exports.RoomExpiryService = RoomExpiryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('room-expiry')),
    __metadata("design:paramtypes", [typeof (_a = typeof bull_2.Queue !== "undefined" && bull_2.Queue) === "function" ? _a : Object])
], RoomExpiryService);
//# sourceMappingURL=room-expiry.service.js.map