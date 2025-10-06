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
var AutoDeleteService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoDeleteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auto_delete_entity_1 = require("../entities/auto-delete.entity");
const message_entity_1 = require("../../messages/message.entity");
const stellar_service_1 = require("../../stellar/stellar.service");
let AutoDeleteService = AutoDeleteService_1 = class AutoDeleteService {
    autoDeleteRepo;
    messageRepo;
    stellarService;
    logger = new common_1.Logger(AutoDeleteService_1.name);
    intervalHandle = null;
    constructor(autoDeleteRepo, messageRepo, stellarService) {
        this.autoDeleteRepo = autoDeleteRepo;
        this.messageRepo = messageRepo;
        this.stellarService = stellarService;
    }
    onModuleInit() {
        this.intervalHandle = setInterval(() => {
            this.processExpired().catch((e) => this.logger.error('processExpired failed', e));
        }, 15000);
    }
    async setTimer(dto) {
        const existingMessage = await this.messageRepo.findOne({
            where: { id: dto.messageId },
        });
        if (!existingMessage)
            throw new Error('Message not found');
        const expiry = dto.expiry
            ? new Date(dto.expiry)
            : new Date(Date.now() + (dto.seconds ?? 0) * 1000);
        let timer = await this.autoDeleteRepo.findOne({
            where: { messageId: dto.messageId },
        });
        if (!timer) {
            timer = this.autoDeleteRepo.create({
                messageId: dto.messageId,
                expiry,
            });
        }
        else {
            timer.expiry = expiry;
        }
        return this.autoDeleteRepo.save(timer);
    }
    async getTimer(messageId) {
        return this.autoDeleteRepo.findOne({ where: { messageId } });
    }
    async processExpired() {
        const now = new Date();
        const due = await this.autoDeleteRepo.find({
            where: { expiry: (0, typeorm_2.LessThan)(now) },
            take: 100,
        });
        if (due.length === 0)
            return;
        for (const timer of due) {
            try {
                const msg = await this.messageRepo.findOne({
                    where: { id: timer.messageId },
                });
                if (msg) {
                    await this.messageRepo.delete({ id: msg.id });
                    await this.stellarService.recordMessageDeletion(msg.id);
                }
                await this.autoDeleteRepo.delete({ id: timer.id });
            }
            catch (err) {
                this.logger.error('Failed to process timer', err);
            }
        }
    }
};
exports.AutoDeleteService = AutoDeleteService;
exports.AutoDeleteService = AutoDeleteService = AutoDeleteService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auto_delete_entity_1.AutoDelete)),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        stellar_service_1.StellarService])
], AutoDeleteService);
//# sourceMappingURL=auto-delete.service.js.map