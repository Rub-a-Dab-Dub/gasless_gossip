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
exports.GamblesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gamble_entity_1 = require("./entities/gamble.entity");
let GamblesService = class GamblesService {
    gambleRepo;
    constructor(gambleRepo) {
        this.gambleRepo = gambleRepo;
    }
    async create(dto) {
        const gamble = await this.gambleRepo.findOne({ where: { gossipId: dto.gossipId } });
        if (gamble) {
            gamble.bets.push({
                userId: dto.userId,
                amount: dto.amount,
                choice: dto.choice,
                txId: dto.txId,
            });
            return this.gambleRepo.save(gamble);
        }
        const newGamble = this.gambleRepo.create({
            gossipId: dto.gossipId,
            bets: [
                {
                    userId: dto.userId,
                    amount: dto.amount,
                    choice: dto.choice,
                    txId: dto.txId,
                },
            ],
        });
        return this.gambleRepo.save(newGamble);
    }
    async resolve(dto) {
        const gamble = await this.gambleRepo.findOne({ where: { id: dto.gambleId } });
        if (!gamble)
            throw new common_1.NotFoundException('Gamble not found');
        gamble.resolvedChoice = dto.outcome;
        return this.gambleRepo.save(gamble);
    }
    async findAll() {
        return this.gambleRepo.find();
    }
    async findOne(id) {
        return this.gambleRepo.findOne({ where: { id } });
    }
};
exports.GamblesService = GamblesService;
exports.GamblesService = GamblesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gamble_entity_1.Gamble)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GamblesService);
//# sourceMappingURL=gambles.service.js.map