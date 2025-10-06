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
var HooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HooksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hook_entity_1 = require("./hook.entity");
const websockets_gateway_1 = require("../websockets/websockets.gateway");
let HooksService = HooksService_1 = class HooksService {
    hookRepository;
    webSocketsGateway;
    logger = new common_1.Logger(HooksService_1.name);
    constructor(hookRepository, webSocketsGateway) {
        this.hookRepository = hookRepository;
        this.webSocketsGateway = webSocketsGateway;
    }
    async processStellarEvent(eventType, data) {
        this.logger.log(`Processing stellar event: ${eventType}`);
        try {
            const hook = this.hookRepository.create({ eventType, data });
            await this.hookRepository.save(hook);
            this.logger.log(`Successfully saved stellar event: ${eventType}`);
            this.webSocketsGateway.server.emit('stellarEvent', { eventType, data });
            this.logger.log(`Emitted stellar event to WebSocket clients: ${eventType}`);
            return hook;
        }
        catch (error) {
            this.logger.error(`Failed to process stellar event: ${eventType}`, error);
            throw error;
        }
    }
};
exports.HooksService = HooksService;
exports.HooksService = HooksService = HooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hook_entity_1.Hook)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        websockets_gateway_1.WebSocketsGateway])
], HooksService);
//# sourceMappingURL=hooks.service.js.map