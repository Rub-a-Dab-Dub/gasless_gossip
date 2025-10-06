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
var XpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const xp_entity_1 = require("./xp.entity");
const processed_event_entity_1 = require("./processed-event.entity");
const stellar_account_entity_1 = require("./stellar-account.entity");
let XpService = XpService_1 = class XpService {
    xpRepo;
    processedRepo;
    stellarAccountRepo;
    dataSource;
    logger = new common_1.Logger(XpService_1.name);
    constructor(xpRepo, processedRepo, stellarAccountRepo, dataSource) {
        this.xpRepo = xpRepo;
        this.processedRepo = processedRepo;
        this.stellarAccountRepo = stellarAccountRepo;
        this.dataSource = dataSource;
    }
    async getXpForUser(userId) {
        const xpRow = await this.xpRepo.findOne({ where: { userId } });
        return xpRow ? xpRow.xpValue : 0;
    }
    async addXp(userId, amount, source) {
        if (amount <= 0)
            return;
        let xpRow = await this.xpRepo.findOne({ where: { userId } });
        if (!xpRow) {
            xpRow = this.xpRepo.create({ userId, xpValue: amount });
        }
        else {
            xpRow.xpValue += amount;
        }
        await this.xpRepo.save(xpRow);
        this.logger.log(`Added ${amount} XP to ${userId} (source=${source})`);
        return xpRow;
    }
    async processStellarEvent(event) {
        const mapping = {
            message: 5,
            token_send: 10,
        };
        const amount = mapping[event.type] ?? 0;
        if (amount > 0) {
            return this.addXp(event.userId, amount, event.type);
        }
        return null;
    }
    async handleEvent(event) {
        return this.dataSource.transaction(async (manager) => {
            const processed = await manager.findOne(processed_event_entity_1.ProcessedEvent, {
                where: { eventId: event.eventId },
            });
            if (processed)
                return null;
            await manager.save(processed_event_entity_1.ProcessedEvent, {
                eventId: event.eventId,
                source: event.type,
            });
            const mapping = { message: 5, token_send: 10 };
            const amount = mapping[event.type] ?? 0;
            if (amount > 0) {
                let resolvedUserId = event.userId;
                try {
                    const mappingRow = await this.stellarAccountRepo.findOne({
                        where: { stellarAccount: event.userId },
                    });
                    if (mappingRow && mappingRow.userId)
                        resolvedUserId = mappingRow.userId;
                }
                catch (e) {
                    this.logger.debug('StellarAccount lookup failed, using raw userId');
                }
                let xpRow = await manager.findOne(xp_entity_1.Xp, {
                    where: { userId: resolvedUserId },
                });
                if (!xpRow) {
                    xpRow = manager.create(xp_entity_1.Xp, {
                        userId: resolvedUserId,
                        xpValue: amount,
                    });
                    const saved = await manager.save(xp_entity_1.Xp, xpRow);
                    if (saved && !saved.userId)
                        saved.userId = resolvedUserId;
                    return saved;
                }
                else {
                    xpRow.xpValue += amount;
                    const saved = await manager.save(xp_entity_1.Xp, xpRow);
                    if (saved && !saved.userId)
                        saved.userId = resolvedUserId;
                    return saved;
                }
            }
            return null;
        });
    }
};
exports.XpService = XpService;
exports.XpService = XpService = XpService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(xp_entity_1.Xp)),
    __param(1, (0, typeorm_1.InjectRepository)(processed_event_entity_1.ProcessedEvent)),
    __param(2, (0, typeorm_1.InjectRepository)(stellar_account_entity_1.StellarAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], XpService);
//# sourceMappingURL=xp.service.js.map