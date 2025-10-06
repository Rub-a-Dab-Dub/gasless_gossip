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
exports.ReputationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reputation_entity_1 = require("./entities/reputation.entity");
const tip_entity_1 = require("../tips/entities/tip.entity");
const message_entity_1 = require("../messages/message.entity");
let ReputationService = class ReputationService {
    reputationRepository;
    tipRepository;
    messageRepository;
    constructor(reputationRepository, tipRepository, messageRepository) {
        this.reputationRepository = reputationRepository;
        this.tipRepository = tipRepository;
        this.messageRepository = messageRepository;
    }
    async getReputation(userId) {
        let reputation = await this.reputationRepository.findOne({ where: { userId } });
        if (!reputation) {
            reputation = this.reputationRepository.create({ userId, score: 0 });
            reputation = await this.reputationRepository.save(reputation);
        }
        return reputation;
    }
    async updateReputation(dto) {
        let reputation = await this.getReputation(dto.userId);
        if (!reputation) {
            reputation = this.reputationRepository.create({ userId: dto.userId, score: 0 });
        }
        if (dto.scoreChange !== undefined) {
            reputation.score += dto.scoreChange;
        }
        return this.reputationRepository.save(reputation);
    }
    async calculateReputationFromActions(userId) {
        const tipsReceived = await this.tipRepository.find({ where: { receiverId: userId.toString() } });
        const tipsScore = tipsReceived.reduce((sum, tip) => sum + Number(tip.amount), 0);
        const messagesSent = await this.messageRepository.count({ where: { senderId: userId.toString() } });
        const messagesScore = messagesSent * 0.1;
        const totalScore = tipsScore + messagesScore;
        return this.updateReputation({ userId, scoreChange: totalScore });
    }
};
exports.ReputationService = ReputationService;
exports.ReputationService = ReputationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reputation_entity_1.Reputation)),
    __param(1, (0, typeorm_1.InjectRepository)(tip_entity_1.Tip)),
    __param(2, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReputationService);
//# sourceMappingURL=reputation.service.js.map