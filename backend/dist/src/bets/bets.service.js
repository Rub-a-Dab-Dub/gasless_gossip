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
exports.BetsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bet_entity_1 = require("./bet.entity");
let BetsService = class BetsService {
    betRepo;
    constructor(betRepo) {
        this.betRepo = betRepo;
    }
    async placeBet(userId, placeBetDto) {
        const escrowTxId = await this.createEscrow(userId, placeBetDto.stakes);
        const bet = this.betRepo.create({
            ...placeBetDto,
            userId,
            txId: escrowTxId,
        });
        return this.betRepo.save(bet);
    }
    async resolveBet(resolveBetDto) {
        const bet = await this.betRepo.findOne({
            where: { id: resolveBetDto.betId },
        });
        if (!bet)
            throw new Error('Bet not found');
        await this.resolveEscrow(bet.txId, resolveBetDto.won);
        bet.status = resolveBetDto.won ? 'won' : 'lost';
        return this.betRepo.save(bet);
    }
    async createEscrow(userId, amount) {
        return `escrow_${Date.now()}_${userId}`;
    }
    async resolveEscrow(txId, won) {
        console.log(`Resolving escrow ${txId}: ${won ? 'release' : 'return'} funds`);
    }
};
exports.BetsService = BetsService;
exports.BetsService = BetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bet_entity_1.Bet)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BetsService);
//# sourceMappingURL=bets.service.js.map