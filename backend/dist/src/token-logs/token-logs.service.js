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
exports.TokenLogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const token_log_entity_1 = require("./token-log.entity");
let TokenLogsService = class TokenLogsService {
    tokenLogRepository;
    constructor(tokenLogRepository) {
        this.tokenLogRepository = tokenLogRepository;
    }
    async logTransaction(dto) {
        const log = this.tokenLogRepository.create(dto);
        return this.tokenLogRepository.save(log);
    }
    async getLogsForUser(userId, query) {
        const where = [];
        if (!query || !query.type) {
            where.push({ fromId: userId });
            where.push({ toId: userId });
        }
        else if (query.type === 'sent') {
            where.push({ fromId: userId });
        }
        else if (query.type === 'received') {
            where.push({ toId: userId });
        }
        let dateFilter = {};
        if (query?.fromDate && query?.toDate) {
            dateFilter = (0, typeorm_2.Between)(new Date(query.fromDate), new Date(query.toDate));
        }
        const page = query?.page && query.page > 0 ? query.page : 1;
        const limit = query?.limit && query.limit > 0 ? query.limit : 20;
        const skip = (page - 1) * limit;
        const [data, total] = await this.tokenLogRepository.findAndCount({
            where: where.map((w) => ({
                ...w,
                ...(dateFilter ? { createdAt: dateFilter } : {}),
            })),
            order: { id: 'DESC' },
            skip,
            take: limit,
        });
        return { data, total, page, limit };
    }
    async getSummaryForUser(userId) {
        const sent = await this.tokenLogRepository
            .createQueryBuilder('log')
            .select('SUM(log.amount)', 'total')
            .where('log.fromId = :userId', { userId })
            .getRawOne();
        const received = await this.tokenLogRepository
            .createQueryBuilder('log')
            .select('SUM(log.amount)', 'total')
            .where('log.toId = :userId', { userId })
            .getRawOne();
        return {
            totalSent: sent?.total || '0',
            totalReceived: received?.total || '0',
        };
    }
};
exports.TokenLogsService = TokenLogsService;
exports.TokenLogsService = TokenLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(token_log_entity_1.TokenLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TokenLogsService);
//# sourceMappingURL=token-logs.service.js.map