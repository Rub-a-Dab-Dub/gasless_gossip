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
var ReactionsTrackerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionsTrackerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reactions_tracker_entity_1 = require("./reactions-tracker.entity");
let ReactionsTrackerService = ReactionsTrackerService_1 = class ReactionsTrackerService {
    reactionTrackRepository;
    logger = new common_1.Logger(ReactionsTrackerService_1.name);
    constructor(reactionTrackRepository) {
        this.reactionTrackRepository = reactionTrackRepository;
    }
    async getReactionsByMessageId(messageId) {
        try {
            const reactionTrack = await this.reactionTrackRepository.findOne({
                where: { messageId },
            });
            return reactionTrack;
        }
        catch (error) {
            this.logger.error(`Error fetching reactions for message ${messageId}`, error);
            throw error;
        }
    }
    async getMostReactedSecrets(filters) {
        try {
            const queryBuilder = this.createFilteredQuery(filters);
            const total = await queryBuilder.getCount();
            queryBuilder
                .orderBy('rt.total_count', filters.sortOrder)
                .addOrderBy('rt.updated_at', 'DESC')
                .limit(filters.limit)
                .offset(filters.offset);
            const data = await queryBuilder.getMany();
            return {
                data,
                total,
                limit: filters.limit,
                offset: filters.offset,
            };
        }
        catch (error) {
            this.logger.error('Error fetching most reacted secrets', error);
            throw error;
        }
    }
    async aggregateReaction(reactionUpdate) {
        try {
            let reactionTrack = await this.reactionTrackRepository.findOne({
                where: { messageId: reactionUpdate.messageId },
            });
            if (!reactionTrack) {
                reactionTrack = this.reactionTrackRepository.create({
                    messageId: reactionUpdate.messageId,
                    totalCount: 0,
                    likeCount: 0,
                    loveCount: 0,
                    laughCount: 0,
                    angryCount: 0,
                    sadCount: 0,
                });
            }
            const countField = `${reactionUpdate.reactionType}Count`;
            reactionTrack[countField] += reactionUpdate.count;
            reactionTrack.totalCount += reactionUpdate.count;
            return await this.reactionTrackRepository.save(reactionTrack);
        }
        catch (error) {
            this.logger.error(`Error aggregating reaction for message ${reactionUpdate.messageId}`, error);
            throw error;
        }
    }
    async removeReaction(reactionUpdate) {
        try {
            const reactionTrack = await this.reactionTrackRepository.findOne({
                where: { messageId: reactionUpdate.messageId },
            });
            if (!reactionTrack) {
                throw new common_1.NotFoundException(`Reaction track not found for message ${reactionUpdate.messageId}`);
            }
            const countField = `${reactionUpdate.reactionType}Count`;
            const currentCount = reactionTrack[countField];
            if (currentCount >= reactionUpdate.count) {
                reactionTrack[countField] -= reactionUpdate.count;
                reactionTrack.totalCount -= reactionUpdate.count;
            }
            else {
                reactionTrack.totalCount -= currentCount;
                reactionTrack[countField] = 0;
            }
            return await this.reactionTrackRepository.save(reactionTrack);
        }
        catch (error) {
            this.logger.error(`Error removing reaction for message ${reactionUpdate.messageId}`, error);
            throw error;
        }
    }
    createFilteredQuery(filters) {
        const queryBuilder = this.reactionTrackRepository
            .createQueryBuilder('rt')
            .select([
            'rt.id',
            'rt.messageId',
            'rt.totalCount',
            'rt.likeCount',
            'rt.loveCount',
            'rt.laughCount',
            'rt.angryCount',
            'rt.sadCount',
            'rt.createdAt',
            'rt.updatedAt',
        ]);
        if (filters.dateFrom) {
            queryBuilder.andWhere('rt.created_at >= :dateFrom', { dateFrom: filters.dateFrom });
        }
        if (filters.dateTo) {
            queryBuilder.andWhere('rt.created_at <= :dateTo', { dateTo: filters.dateTo });
        }
        if (filters.reactionType) {
            const countColumn = `rt.${filters.reactionType}_count`;
            queryBuilder.andWhere(`${countColumn} > 0`);
        }
        return queryBuilder;
    }
};
exports.ReactionsTrackerService = ReactionsTrackerService;
exports.ReactionsTrackerService = ReactionsTrackerService = ReactionsTrackerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reactions_tracker_entity_1.ReactionTrack)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReactionsTrackerService);
//# sourceMappingURL=reactions-tracker.service.js.map