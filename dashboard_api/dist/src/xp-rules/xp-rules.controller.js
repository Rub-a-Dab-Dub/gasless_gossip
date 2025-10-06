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
Object.defineProperty(exports, "__esModule", { value: true });
exports.XpRulesController = void 0;
const common_1 = require("@nestjs/common");
let XpRulesController = class XpRulesController {
    xpRulesService;
    constructor(xpRulesService) {
        this.xpRulesService = xpRulesService;
    }
    async createRule(dto) {
        return this.xpRulesService.createRule(dto);
    }
    async updateRule(ruleId, dto) {
        return this.xpRulesService.updateRule(ruleId, dto);
    }
    async getActiveRules(scope) {
        return this.xpRulesService.getActiveRules(scope);
    }
    async applyGlobalRules(userId, ruleType, baseXp) {
        return this.xpRulesService.applyGlobalRules(userId, ruleType, baseXp);
    }
    async simulateImpact(dto) {
        return this.xpRulesService.simulateImpact(dto);
    }
    async applySimulation(dto) {
        return this.xpRulesService.applySimulation(dto);
    }
    async getRuleVersions(ruleId) {
        return this.xpRulesService.getRuleVersions(ruleId);
    }
    async getSimulations(limit) {
        return this.xpRulesService.getSimulations(limit);
    }
    async getUserNotifications(userId, unreadOnly) {
        return this.xpRulesService.getUserNotifications(userId, unreadOnly);
    }
    async markNotificationRead(notificationId) {
        return this.xpRulesService.markNotificationRead(notificationId);
    }
};
exports.XpRulesController = XpRulesController;
__decorate([
    (0, common_1.Post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], XpRulesController.prototype, "createRule", null);
__decorate([
    (0, common_1.Put)(":ruleId"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], XpRulesController.prototype, "updateRule", null);
__decorate([
    (0, common_1.Get)("active"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], XpRulesController.prototype, "getActiveRules", null);
__decorate([
    (0, common_1.Post)("apply"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], XpRulesController.prototype, "applyGlobalRules", null);
__decorate([
    (0, common_1.Post)("simulate"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], XpRulesController.prototype, "simulateImpact", null);
__decorate([
    (0, common_1.Post)("apply-simulation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], XpRulesController.prototype, "applySimulation", null);
__decorate([
    (0, common_1.Get)(":ruleId/versions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], XpRulesController.prototype, "getRuleVersions", null);
__decorate([
    (0, common_1.Get)("simulations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], XpRulesController.prototype, "getSimulations", null);
__decorate([
    (0, common_1.Get)("notifications/:userId"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], XpRulesController.prototype, "getUserNotifications", null);
__decorate([
    (0, common_1.Put)("notifications/:notificationId/read"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], XpRulesController.prototype, "markNotificationRead", null);
exports.XpRulesController = XpRulesController = __decorate([
    (0, common_1.Controller)("xp-rules"),
    __metadata("design:paramtypes", [Function])
], XpRulesController);
//# sourceMappingURL=xp-rules.controller.js.map