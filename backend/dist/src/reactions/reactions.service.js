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
const reaction_entity_1 = require("./reaction.entity");
let ReactionsService = class ReactionsService {
    reactionRepository;
    constructor(reactionRepository) {
        this.reactionRepository = reactionRepository;
    }
    async addReaction(dto) {
        const reaction = this.reactionRepository.create(dto);
        const saved = await this.reactionRepository.save(reaction);
        return saved;
    }
    async getReactionsForMessage(messageId) {
        return this.reactionRepository.find({ where: { messageId } });
    }
    async countReactions(messageId) {
        const reactions = await this.getReactionsForMessage(messageId);
        return reactions.reduce((acc, r) => {
            acc[r.type] = (acc[r.type] || 0) + 1;
            return acc;
        }, {});
    }
};
exports.ReactionsService = ReactionsService;
exports.ReactionsService = ReactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reaction_entity_1.Reaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReactionsService);
//# sourceMappingURL=reactions.service.js.map