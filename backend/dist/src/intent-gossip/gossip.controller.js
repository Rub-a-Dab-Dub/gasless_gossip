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
var GossipController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GossipController = void 0;
const common_1 = require("@nestjs/common");
const intent_gossip_service_1 = require("./intent-gossip.service");
const broadcast_intent_dto_1 = require("./dto/broadcast-intent.dto");
const auth_guard_1 = require("../auth/auth.guard");
let GossipController = GossipController_1 = class GossipController {
    intentGossipService;
    logger = new common_1.Logger(GossipController_1.name);
    constructor(intentGossipService) {
        this.intentGossipService = intentGossipService;
    }
    async broadcastIntent(req, broadcastIntentDto) {
        const userId = req.user.id;
        this.logger.log(`User ${userId} broadcasting intent of type ${broadcastIntentDto.type}`);
        await this.intentGossipService.broadcastIntent(userId, broadcastIntentDto);
        return {
            success: true,
            message: 'Intent broadcast successfully',
        };
    }
};
exports.GossipController = GossipController;
__decorate([
    (0, common_1.Post)('intents'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, broadcast_intent_dto_1.BroadcastIntentDto]),
    __metadata("design:returntype", Promise)
], GossipController.prototype, "broadcastIntent", null);
exports.GossipController = GossipController = GossipController_1 = __decorate([
    (0, common_1.Controller)('api/gossip'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [intent_gossip_service_1.IntentGossipService])
], GossipController);
//# sourceMappingURL=gossip.controller.js.map