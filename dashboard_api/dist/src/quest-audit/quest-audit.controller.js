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
exports.QuestAuditController = void 0;
const common_1 = require("@nestjs/common");
let QuestAuditController = class QuestAuditController {
    questAuditService;
    constructor(questAuditService) {
        this.questAuditService = questAuditService;
    }
    async logCompletion(dto) {
        return this.questAuditService.logCompletion(dto);
    }
    async detectDuplicates(userId, questId) {
        return this.questAuditService.detectDuplicates(userId, questId);
    }
    async reverseCompletion(dto) {
        return this.questAuditService.reverseCompletion(dto);
    }
    async getUserHistory(userId, limit) {
        return this.questAuditService.getUserHistory(userId, limit);
    }
    async getAlerts(query) {
        return this.questAuditService.getAlerts(query);
    }
    async bulkAudit(dto) {
        return this.questAuditService.bulkAudit(dto);
    }
    async getExploitPatterns() {
        return this.questAuditService.getExploitPatterns();
    }
    async getPatternDashboard() {
        return this.questAuditService.getPatternDashboard();
    }
};
exports.QuestAuditController = QuestAuditController;
__decorate([
    (0, common_1.Post)("completions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], QuestAuditController.prototype, "logCompletion", null);
__decorate([
    (0, common_1.Get)("completions/duplicates"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QuestAuditController.prototype, "detectDuplicates", null);
__decorate([
    (0, common_1.Put)("completions/reverse"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], QuestAuditController.prototype, "reverseCompletion", null);
__decorate([
    (0, common_1.Get)("users/:userId/history"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], QuestAuditController.prototype, "getUserHistory", null);
__decorate([
    (0, common_1.Get)("alerts"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], QuestAuditController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Post)("bulk"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], QuestAuditController.prototype, "bulkAudit", null);
__decorate([
    (0, common_1.Get)("patterns"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuestAuditController.prototype, "getExploitPatterns", null);
__decorate([
    (0, common_1.Get)("dashboard"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuestAuditController.prototype, "getPatternDashboard", null);
exports.QuestAuditController = QuestAuditController = __decorate([
    (0, common_1.Controller)("quest-audit"),
    __metadata("design:paramtypes", [Function])
], QuestAuditController);
//# sourceMappingURL=quest-audit.controller.js.map