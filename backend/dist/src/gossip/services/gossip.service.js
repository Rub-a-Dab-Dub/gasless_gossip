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
var GossipService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GossipService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gossip_intent_entity_1 = require("../entities/gossip-intent.entity");
const gossip_update_entity_1 = require("../entities/gossip-update.entity");
let GossipService = GossipService_1 = class GossipService {
    intentRepo;
    updateRepo;
    logger = new common_1.Logger(GossipService_1.name);
    constructor(intentRepo, updateRepo) {
        this.intentRepo = intentRepo;
        this.updateRepo = updateRepo;
    }
    async createIntent(dto, userId) {
        const expiresAt = dto.expiresInMinutes
            ? new Date(Date.now() + dto.expiresInMinutes * 60 * 1000)
            : new Date(Date.now() + 24 * 60 * 60 * 1000);
        const intent = this.intentRepo.create({
            roomId: dto.roomId,
            userId,
            content: dto.content,
            metadata: dto.metadata,
            expiresAt,
        });
        const savedIntent = await this.intentRepo.save(intent);
        await this.createUpdate({
            intentId: savedIntent.id,
            userId,
            type: 'new_intent',
            content: dto.content,
        });
        return this.mapIntentToDto(savedIntent);
    }
    async updateIntentStatus(dto, userId) {
        const intent = await this.intentRepo.findOne({ where: { id: dto.intentId } });
        if (!intent) {
            throw new common_1.NotFoundException('Gossip intent not found');
        }
        intent.status = dto.status;
        const updatedIntent = await this.intentRepo.save(intent);
        await this.createUpdate({
            intentId: intent.id,
            userId,
            type: 'status_change',
            content: dto.reason,
            metadata: { oldStatus: intent.status, newStatus: dto.status },
        });
        return this.mapIntentToDto(updatedIntent);
    }
    async voteIntent(dto, userId) {
        const intent = await this.intentRepo.findOne({ where: { id: dto.intentId } });
        if (!intent) {
            throw new common_1.NotFoundException('Gossip intent not found');
        }
        if (dto.action === 'upvote') {
            intent.upvotes += 1;
        }
        else if (dto.action === 'downvote') {
            intent.downvotes += 1;
        }
        else if (dto.action === 'remove') {
            intent.upvotes = Math.max(0, intent.upvotes - 1);
        }
        const updatedIntent = await this.intentRepo.save(intent);
        await this.createUpdate({
            intentId: intent.id,
            userId,
            type: 'vote',
            content: dto.action,
        });
        return this.mapIntentToDto(updatedIntent);
    }
    async commentIntent(dto, userId) {
        const intent = await this.intentRepo.findOne({ where: { id: dto.intentId } });
        if (!intent) {
            throw new common_1.NotFoundException('Gossip intent not found');
        }
        const update = await this.createUpdate({
            intentId: dto.intentId,
            userId,
            type: 'comment',
            content: dto.content,
        });
        return this.mapUpdateToDto(update);
    }
    async getIntentById(intentId) {
        const intent = await this.intentRepo.findOne({ where: { id: intentId } });
        if (!intent) {
            throw new common_1.NotFoundException('Gossip intent not found');
        }
        return this.mapIntentToDto(intent);
    }
    async getIntentsByRoom(roomId, limit = 50) {
        const intents = await this.intentRepo.find({
            where: { roomId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
        return intents.map(intent => this.mapIntentToDto(intent));
    }
    async getUpdatesByIntent(intentId) {
        const updates = await this.updateRepo.find({
            where: { intentId },
            order: { createdAt: 'ASC' },
        });
        return updates.map(update => this.mapUpdateToDto(update));
    }
    async getRecentUpdates(roomId, limit = 20) {
        const updates = await this.updateRepo
            .createQueryBuilder('update')
            .leftJoin('update.intent', 'intent')
            .where('intent.roomId = :roomId', { roomId })
            .orderBy('update.createdAt', 'DESC')
            .limit(limit)
            .getMany();
        return updates.map(update => this.mapUpdateToDto(update));
    }
    async createUpdate(data) {
        const update = this.updateRepo.create(data);
        return this.updateRepo.save(update);
    }
    mapIntentToDto(intent) {
        return {
            id: intent.id,
            roomId: intent.roomId,
            userId: intent.userId,
            content: intent.content,
            status: intent.status,
            metadata: intent.metadata,
            upvotes: intent.upvotes,
            downvotes: intent.downvotes,
            expiresAt: intent.expiresAt,
            createdAt: intent.createdAt,
            updatedAt: intent.updatedAt,
        };
    }
    mapUpdateToDto(update) {
        return {
            id: update.id,
            intentId: update.intentId,
            userId: update.userId,
            type: update.type,
            content: update.content,
            metadata: update.metadata,
            createdAt: update.createdAt,
        };
    }
    async getPerformanceMetrics() {
        const [totalIntents, totalUpdates] = await Promise.all([
            this.intentRepo.count(),
            this.updateRepo.count(),
        ]);
        return {
            totalIntents,
            totalUpdates,
            averageResponseTime: 0,
            activeConnections: 0,
        };
    }
};
exports.GossipService = GossipService;
exports.GossipService = GossipService = GossipService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gossip_intent_entity_1.GossipIntent)),
    __param(1, (0, typeorm_1.InjectRepository)(gossip_update_entity_1.GossipUpdate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], GossipService);
//# sourceMappingURL=gossip.service.js.map