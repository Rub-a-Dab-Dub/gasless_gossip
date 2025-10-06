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
var HooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HooksService = void 0;
const common_1 = require("@nestjs/common");
const hook_repository_1 = require("../repositories/hook.repository");
const hooks_gateway_1 = require("../gateways/hooks.gateway");
const hook_entity_1 = require("../entities/hook.entity");
const stellar_service_1 = require("./stellar.service");
let HooksService = HooksService_1 = class HooksService {
    hookRepository;
    hooksGateway;
    stellarService;
    logger = new common_1.Logger(HooksService_1.name);
    constructor(hookRepository, hooksGateway, stellarService) {
        this.hookRepository = hookRepository;
        this.hooksGateway = hooksGateway;
        this.stellarService = stellarService;
    }
    async createHook(createHookDto) {
        try {
            if (createHookDto.stellarTransactionId) {
                const existingHook = await this.hookRepository.findByTransactionId(createHookDto.stellarTransactionId);
                if (existingHook) {
                    this.logger.warn(`Duplicate transaction ID: ${createHookDto.stellarTransactionId}`);
                    return this.mapToResponseDto(existingHook);
                }
            }
            const hook = await this.hookRepository.create(createHookDto);
            this.hooksGateway.broadcastHookCreated(hook);
            this.processHookAsync(hook.id);
            this.logger.log(`Hook created successfully: ${hook.id}`);
            return this.mapToResponseDto(hook);
        }
        catch (error) {
            this.logger.error(`Failed to create hook: ${error.message}`);
            throw error;
        }
    }
    async processStellarEvent(stellarEventDto) {
        try {
            const isValidTransaction = await this.stellarService.validateTransaction(stellarEventDto.transactionId);
            if (!isValidTransaction) {
                throw new Error(`Invalid Stellar transaction: ${stellarEventDto.transactionId}`);
            }
            const createHookDto = {
                eventType: stellarEventDto.eventType,
                data: stellarEventDto.eventData,
                stellarTransactionId: stellarEventDto.transactionId,
                stellarAccountId: stellarEventDto.accountId,
            };
            return await this.createHook(createHookDto);
        }
        catch (error) {
            this.logger.error(`Failed to process Stellar event: ${error.message}`);
            throw error;
        }
    }
    async getHookById(id) {
        const hook = await this.hookRepository.findById(id);
        if (!hook) {
            throw new common_1.NotFoundException(`Hook with ID ${id} not found`);
        }
        return this.mapToResponseDto(hook);
    }
    async getRecentHooks(limit = 50) {
        const hooks = await this.hookRepository.findRecent(limit);
        return hooks.map(hook => this.mapToResponseDto(hook));
    }
    async getHooksByEventType(eventType, limit = 100) {
        const hooks = await this.hookRepository.findByEventType(eventType, limit);
        return hooks.map(hook => this.mapToResponseDto(hook));
    }
    async processUnprocessedHooks() {
        try {
            const unprocessedHooks = await this.hookRepository.findUnprocessed();
            this.logger.log(`Processing ${unprocessedHooks.length} unprocessed hooks`);
            for (const hook of unprocessedHooks) {
                await this.processHookAsync(hook.id);
            }
        }
        catch (error) {
            this.logger.error(`Failed to process unprocessed hooks: ${error.message}`);
        }
    }
    async processHookAsync(hookId) {
        try {
            const hook = await this.hookRepository.findById(hookId);
            if (!hook || hook.processed) {
                return;
            }
            let processResult;
            switch (hook.eventType) {
                case hook_entity_1.EventType.XP_UPDATE:
                    processResult = await this.processXpUpdate(hook);
                    break;
                case hook_entity_1.EventType.TOKEN_SEND:
                    processResult = await this.processTokenSend(hook);
                    break;
                case hook_entity_1.EventType.TOKEN_RECEIVE:
                    processResult = await this.processTokenReceive(hook);
                    break;
                case hook_entity_1.EventType.CONTRACT_CALL:
                    processResult = await this.processContractCall(hook);
                    break;
                case hook_entity_1.EventType.ACCOUNT_CREATED:
                    processResult = await this.processAccountCreated(hook);
                    break;
                default:
                    throw new Error(`Unknown event type: ${hook.eventType}`);
            }
            await this.hookRepository.markAsProcessed(hook.id);
            const updatedHook = await this.hookRepository.findById(hookId);
            if (updatedHook) {
                this.hooksGateway.broadcastHookProcessed(updatedHook);
            }
            this.logger.log(`Hook processed successfully: ${hookId}`);
        }
        catch (error) {
            this.logger.error(`Failed to process hook ${hookId}: ${error.message}`);
            await this.hookRepository.markAsProcessed(hookId, error.message);
        }
    }
    async processXpUpdate(hook) {
        const { userId, xpAmount, reason } = hook.data;
        this.logger.log(`Processing XP update: User ${userId}, Amount: ${xpAmount}`);
        return { success: true, updatedXp: xpAmount };
    }
    async processTokenSend(hook) {
        const { fromAccount, toAccount, amount, assetCode } = hook.data;
        this.logger.log(`Processing token send: ${amount} ${assetCode} from ${fromAccount} to ${toAccount}`);
        return { success: true, transactionProcessed: true };
    }
    async processTokenReceive(hook) {
        const { account, amount, assetCode, fromAccount } = hook.data;
        this.logger.log(`Processing token receive: ${account} received ${amount} ${assetCode} from ${fromAccount}`);
        return { success: true, received: true };
    }
    async processContractCall(hook) {
        const { contractId, functionName, parameters } = hook.data;
        this.logger.log(`Processing contract call: ${contractId}.${functionName}`);
        return { success: true, contractExecuted: true };
    }
    async processAccountCreated(hook) {
        const { accountId, startingBalance } = hook.data;
        this.logger.log(`Processing account created: ${accountId} with balance ${startingBalance}`);
        return { success: true, accountRegistered: true };
    }
    mapToResponseDto(hook) {
        return {
            id: hook.id,
            eventType: hook.eventType,
            data: hook.data,
            stellarTransactionId: hook.stellarTransactionId,
            stellarAccountId: hook.stellarAccountId,
            processed: hook.processed,
            createdAt: hook.createdAt,
            processedAt: hook.processedAt,
            errorMessage: hook.errorMessage,
        };
    }
    async getHookStats() {
        const stats = {
            totalHooks: await this.hookRepository.findRecent(1000).then(hooks => hooks.length),
            processedHooks: await this.hookRepository.findRecent(1000).then(hooks => hooks.filter(h => h.processed).length),
            connectedClients: this.hooksGateway.getConnectedClientsCount(),
            eventTypeDistribution: {
                xp_update: 0,
                token_send: 0,
                token_receive: 0,
                contract_call: 0,
                account_created: 0,
            }
        };
        this.hooksGateway.broadcastStats(stats);
        return stats;
    }
};
exports.HooksService = HooksService;
exports.HooksService = HooksService = HooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hook_repository_1.HookRepository,
        hooks_gateway_1.HooksGateway,
        stellar_service_1.StellarService])
], HooksService);
//# sourceMappingURL=hooks.service.js.map