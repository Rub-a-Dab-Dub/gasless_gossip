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
exports.ReputationController = void 0;
const common_1 = require("@nestjs/common");
const reputation_service_1 = require("./reputation.service");
const update_reputation_dto_1 = require("./dto/update-reputation.dto");
let ReputationController = class ReputationController {
    reputationService;
    constructor(reputationService) {
        this.reputationService = reputationService;
    }
    async getReputation(userId) {
        return this.reputationService.getReputation(Number(userId));
    }
    async updateReputation(dto) {
        return this.reputationService.updateReputation(dto);
    }
    async calculateReputation(userId) {
        return this.reputationService.calculateReputationFromActions(Number(userId));
    }
};
exports.ReputationController = ReputationController;
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReputationController.prototype, "getReputation", null);
__decorate([
    (0, common_1.Post)('update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_reputation_dto_1.UpdateReputationDto]),
    __metadata("design:returntype", Promise)
], ReputationController.prototype, "updateReputation", null);
__decorate([
    (0, common_1.Post)('calculate/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReputationController.prototype, "calculateReputation", null);
exports.ReputationController = ReputationController = __decorate([
    (0, common_1.Controller)('reputation'),
    __metadata("design:paramtypes", [reputation_service_1.ReputationService])
], ReputationController);
//# sourceMappingURL=reputation.controller.js.map