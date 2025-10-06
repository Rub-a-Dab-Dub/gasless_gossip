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
var GiftsService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gift_entity_1 = require("./entities/gift.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
let GiftsService = GiftsService_1 = class GiftsService {
    giftRepo;
    eventEmitter;
    logger = new common_1.Logger(GiftsService_1.name);
    constructor(giftRepo, eventEmitter) {
        this.giftRepo = giftRepo;
        this.eventEmitter = eventEmitter;
    }
    async sendGift(senderId, dto) {
        const txId = null;
        const gift = this.giftRepo.create(dto);
        const saved = await this.giftRepo.save(gift);
        this.eventEmitter.emit('gift.sent', { senderId, ...saved });
        return saved;
    }
    async getGiftsForUser(userId) {
        return this.giftRepo.find({
            where: { ownerId: userId },
            order: { createdAt: 'DESC' },
        });
    }
};
exports.GiftsService = GiftsService;
exports.GiftsService = GiftsService = GiftsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gift_entity_1.Gift)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeof (_a = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _a : Object])
], GiftsService);
//# sourceMappingURL=gifts.service.js.map