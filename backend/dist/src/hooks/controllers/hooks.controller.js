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
var HooksController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HooksController = void 0;
const common_1 = require("@nestjs/common");
const hooks_service_1 = require("../services/hooks.service");
const hook_dto_1 = require("../dto/hook.dto");
const hook_entity_1 = require("../entities/hook.entity");
let HooksController = HooksController_1 = class HooksController {
    hooksService;
    logger = new common_1.Logger(HooksController_1.name);
    constructor(hooksService) {
        this.hooksService = hooksService;
    }
    async processStellarEvent(stellarEventDto) {
        try {
            this.logger.log(`Received Stellar event: ${stellarEventDto.eventType} for transaction ${stellarEventDto.transactionId}`);
            const result = await this.hooksService.processStellarEvent(stellarEventDto);
            this.logger.log(`Successfully processed Stellar event: ${result.id}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to process Stellar event: ${error.message}`);
            throw error;
        }
    }
    async createHook(createHookDto) {
        try {
            this.logger.log(`Creating hook: ${createHookDto.eventType}`);
            const result = await this.hooksService.createHook(createHookDto);
            this.logger.log(`Successfully created hook: ${result.id}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to create hook: ${error.message}`);
            throw error;
        }
    }
    async getHookById(id) {
        return await this.hooksService.getHookById(id);
    }
    async getHooks(limit, eventType) {
        const limitNumber = limit ? parseInt(limit, 10) : 50;
        if (eventType) {
            return await this.hooksService.getHooksByEventType(eventType, limitNumber);
        }
        return await this.hooksService.getRecentHooks(limitNumber);
    }
    async processUnprocessedHooks() {
        this.logger.log('Manual trigger: Processing unprocessed hooks');
        await this.hooksService.processUnprocessedHooks();
    }
    async getHookStats() {
        return await this.hooksService.getHookStats();
    }
};
exports.HooksController = HooksController;
__decorate([
    (0, common_1.Post)('stellar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hook_dto_1.StellarEventDto]),
    __metadata("design:returntype", Promise)
], HooksController.prototype, "processStellarEvent", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hook_dto_1.CreateHookDto]),
    __metadata("design:returntype", Promise)
], HooksController.prototype, "createHook", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HooksController.prototype, "getHookById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('eventType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HooksController.prototype, "getHooks", null);
__decorate([
    (0, common_1.Post)('process-unprocessed'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HooksController.prototype, "processUnprocessedHooks", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HooksController.prototype, "getHookStats", null);
exports.HooksController = HooksController = HooksController_1 = __decorate([
    (0, common_1.Controller)('hooks'),
    __metadata("design:paramtypes", [hooks_service_1.HooksService])
], HooksController);
//# sourceMappingURL=hooks.controller.js.map