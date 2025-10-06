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
exports.ReactionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reaction_entity_1 = require("./entities/reaction.entity");
let ReactionsService = class ReactionsService {
    reactionRepository;
    constructor(reactionRepository) {
        this.reactionRepository = reactionRepository;
    }
    async createReaction(createReactionDto, userId) {
        await this.validateMessageAccess(createReactionDto.messageId, userId);
        const existingReaction = await this.reactionRepository.findOne({
            where: {
                messageId: createReactionDto.messageId,
                userId,
            },
        });
        if (existingReaction) {
            if (existingReaction.type === createReactionDto.type) {
                throw new common_1.ConflictException('User has already reacted with this type');
            }
            existingReaction.type = createReactionDto.type;
            const updatedReaction = await this.reactionRepository.save(existingReaction);
            await this.triggerXpUpdate(createReactionDto.messageId, userId, 'update');
            return updatedReaction;
        }
        const reaction = this.reactionRepository.create({
            ...createReactionDto,
            userId,
        });
        const savedReaction = await this.reactionRepository.save(reaction);
        await this.triggerXpUpdate(createReactionDto.messageId, userId, 'create');
        return savedReaction;
    }
    async removeReaction(messageId, userId) {
        await this.validateMessageAccess(messageId, userId);
        const reaction = await this.reactionRepository.findOne({
            where: { messageId, userId },
        });
        if (!reaction) {
            throw new common_1.NotFoundException('Reaction not found');
        }
        await this.reactionRepository.remove(reaction);
        await this.triggerXpUpdate(messageId, userId, 'remove');
    }
    async getReactionsByMessage(messageId, userId) {
        await this.validateMessageAccess(messageId, userId);
        const reactions = await this.reactionRepository.find({
            where: { messageId },
        });
        const totalCount = reactions.length;
        const countByType = reactions.reduce((acc, reaction) => {
            acc[reaction.type] = (acc[reaction.type] || 0) + 1;
            return acc;
        }, {});
        Object.values(reaction_entity_1.ReactionType).forEach((type) => {
            if (!countByType[type]) {
                countByType[type] = 0;
            }
        });
        return {
            messageId,
            totalCount,
            countByType,
        };
    }
    async getUserReactionForMessage(messageId, userId) {
        await this.validateMessageAccess(messageId, userId);
        return this.reactionRepository.findOne({
            where: { messageId, userId },
        });
    }
    async validateMessageAccess(messageId, userId) {
        try {
            if (!messageId || !userId) {
                throw new common_1.ForbiddenException('Invalid message or user');
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException('Message not found');
            }
            if (error instanceof common_1.ForbiddenException) {
                throw new common_1.ForbiddenException('No access to this message');
            }
            throw error;
        }
    }
    async triggerXpUpdate(messageId, reactorUserId, action) {
        try {
            const xpAmount = this.getXpAmountForAction(action);
            console.log(`XP Update triggered: ${action} reaction on message ${messageId} by user ${reactorUserId}, XP: ${xpAmount}`);
        }
        catch (error) {
            console.error('Failed to update XP:', error);
        }
    }
    getXpAmountForAction(action) {
        switch (action) {
            case 'create':
                return 5;
            case 'update':
                return 2;
            case 'remove':
                return -3;
            default:
                return 0;
        }
    }
    async getReactionStats() {
        const totalReactions = await this.reactionRepository.count();
        const reactionsByType = await this.reactionRepository
            .createQueryBuilder('reaction')
            .select('reaction.type', 'type')
            .addSelect('COUNT(*)', 'count')
            .groupBy('reaction.type')
            .getRawMany();
        return {
            totalReactions,
            reactionsByType: reactionsByType.reduce((acc, item) => {
                acc[item.type] = parseInt(item.count);
                return acc;
            }, {}),
        };
    }
};
exports.ReactionsService = ReactionsService;
exports.ReactionsService = ReactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reaction_entity_1.Reaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReactionsService);
//# sourceMappingURL=reactions.service.js.map