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
var IntentGossipService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentGossipService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const intent_log_entity_1 = require("./entities/intent-log.entity");
let IntentGossipService = IntentGossipService_1 = class IntentGossipService {
    intentLogRepository;
    logger = new common_1.Logger(IntentGossipService_1.name);
    constructor(intentLogRepository) {
        this.intentLogRepository = intentLogRepository;
    }
    async broadcastIntent(userId, broadcastIntentDto) {
        const { type, payload, chains } = broadcastIntentDto;
        try {
            this.logger.log(`Broadcasting intent of type ${type} to chains: ${chains.join(', ')}`);
            await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
            const intentLog = this.intentLogRepository.create({
                type,
                payload,
                chains,
                user: { id: userId },
            });
            await this.intentLogRepository.save(intentLog);
            this.logger.log(`Successfully broadcast intent ${type} and logged to database`);
        }
        catch (error) {
            this.logger.error(`Failed to broadcast intent: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getIntentLogsByUser(userId) {
        return this.intentLogRepository.find({
            where: {
                user: { id: userId },
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }
};
exports.IntentGossipService = IntentGossipService;
exports.IntentGossipService = IntentGossipService = IntentGossipService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(intent_log_entity_1.IntentLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IntentGossipService);
//# sourceMappingURL=intent-gossip.service.js.map