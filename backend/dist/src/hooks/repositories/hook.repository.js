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
exports.HookRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hook_entity_1 = require("../entities/hook.entity");
let HookRepository = class HookRepository {
    hookRepository;
    constructor(hookRepository) {
        this.hookRepository = hookRepository;
    }
    async create(hookData) {
        const hook = this.hookRepository.create(hookData);
        return await this.hookRepository.save(hook);
    }
    async findById(id) {
        return await this.hookRepository.findOne({ where: { id } });
    }
    async findByTransactionId(transactionId) {
        return await this.hookRepository.findOne({
            where: { stellarTransactionId: transactionId }
        });
    }
    async findUnprocessed() {
        return await this.hookRepository.find({
            where: { processed: false },
            order: { createdAt: 'ASC' }
        });
    }
    async findByEventType(eventType, limit = 100) {
        return await this.hookRepository.find({
            where: { eventType },
            order: { createdAt: 'DESC' },
            take: limit
        });
    }
    async markAsProcessed(id, errorMessage) {
        await this.hookRepository.update(id, {
            processed: true,
            processedAt: new Date(),
            errorMessage
        });
    }
    async findRecent(limit = 50) {
        return await this.hookRepository.find({
            order: { createdAt: 'DESC' },
            take: limit
        });
    }
};
exports.HookRepository = HookRepository;
exports.HookRepository = HookRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hook_entity_1.Hook)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HookRepository);
//# sourceMappingURL=hook.repository.js.map