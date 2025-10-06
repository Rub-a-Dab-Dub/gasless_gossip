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
const hooks_service_1 = require("./hooks.service");
let HooksController = HooksController_1 = class HooksController {
    hooksService;
    logger = new common_1.Logger(HooksController_1.name);
    constructor(hooksService) {
        this.hooksService = hooksService;
    }
    async handleStellarEvent(body, request) {
        const eventType = body.eventType;
        const data = body.data;
        this.logger.log(`Stellar event received: ${eventType} from ${request.ip}`);
        if (!eventType || !data) {
            this.logger.error('Invalid payload received - missing eventType or data');
            throw new common_1.HttpException('Invalid payload', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const hook = await this.hooksService.processStellarEvent(eventType, data);
            this.logger.log(`Successfully processed stellar event: ${eventType}`);
            return { status: 'success', hook };
        }
        catch (error) {
            this.logger.error(`Failed to process stellar event: ${eventType}`, error);
            throw new common_1.HttpException('Failed to process event', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.HooksController = HooksController;
__decorate([
    (0, common_1.Post)('stellar'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HooksController.prototype, "handleStellarEvent", null);
exports.HooksController = HooksController = HooksController_1 = __decorate([
    (0, common_1.Controller)('hooks'),
    __metadata("design:paramtypes", [hooks_service_1.HooksService])
], HooksController);
//# sourceMappingURL=hooks.controller.js.map