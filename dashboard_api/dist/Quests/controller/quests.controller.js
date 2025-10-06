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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let QuestsController = class QuestsController {
    questsService;
    constructor(questsService) {
        this.questsService = questsService;
    }
    create(createQuestDto) {
        return this.questsService.create(createQuestDto);
    }
    findAll(status) {
        return this.questsService.findAll(status);
    }
    findOne(id) {
        return this.questsService.findOne(id);
    }
    update(id, updateQuestDto) {
        return this.questsService.update(id, updateQuestDto);
    }
    remove(id) {
        return this.questsService.delete(id);
    }
    getStats(id) {
        return this.questsService.getQuestStats(id);
    }
    incrementProgress(questId, userId, amount = 1) {
        return this.questsService.incrementProgress(userId, questId, amount);
    }
    getUserProgress(userId) {
        return this.questsService.getUserStreaks(userId);
    }
    getUserStreaks(userId) {
        return this.questsService.getUserStreaks(userId);
    }
    getHistory(userId, questId) {
        return this.questsService.getUserCompletionHistory(userId, questId);
    }
    createFrenzy(body) {
        return this.questsService.createFrenzy(body.name, body.description, body.multiplier, body.startsAt, body.endsAt, body.questIds);
    }
    getActiveFrenzy(questId) {
        return this.questsService.getActiveFrenzy(questId);
    }
    applyBoost(dto) {
        return this.questsService.applyBoostToUser(dto);
    }
    detectDuplicates() {
        return this.questsService.detectMultipleCompletions();
    }
};
exports.QuestsController = QuestsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new quest (Admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof CreateQuestDto !== "undefined" && CreateQuestDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], QuestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all quests' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof QuestStatus !== "undefined" && QuestStatus) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], QuestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get quest by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a quest (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof UpdateQuestDto !== "undefined" && UpdateQuestDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], QuestsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'End a quest prematurely (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuestsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get quest completion statistics' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuestsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)(':id/progress'),
    (0, swagger_1.ApiOperation)({ summary: 'Increment quest progress for user' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('userId')),
    __param(2, (0, common_1.Body)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], QuestsController.prototype, "incrementProgress", null);
__decorate([
    (0, common_1.Get)('user/:userId/progress'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user progress for all quests' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuestsController.prototype, "getUserProgress", null);
__decorate([
    (0, common_1.Get)('user/:userId/streaks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user streaks' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuestsController.prototype, "getUserStreaks", null);
__decorate([
    (0, common_1.Get)('user/:userId/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user completion history' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('questId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], QuestsController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Post)('frenzy'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a frenzy event (Admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QuestsController.prototype, "createFrenzy", null);
__decorate([
    (0, common_1.Get)('frenzy/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active frenzy event' }),
    __param(0, (0, common_1.Query)('questId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuestsController.prototype, "getActiveFrenzy", null);
__decorate([
    (0, common_1.Post)('boost/apply'),
    (0, swagger_1.ApiOperation)({ summary: 'Apply boost to user (Admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof ApplyFrenzyBoostDto !== "undefined" && ApplyFrenzyBoostDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], QuestsController.prototype, "applyBoost", null);
__decorate([
    (0, common_1.Get)('audit/duplicates'),
    (0, swagger_1.ApiOperation)({ summary: 'Detect multiple completions (Admin only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QuestsController.prototype, "detectDuplicates", null);
exports.QuestsController = QuestsController = __decorate([
    (0, swagger_1.ApiTags)('quests'),
    (0, common_1.Controller)('quests'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof QuestsService !== "undefined" && QuestsService) === "function" ? _a : Object])
], QuestsController);
//# sourceMappingURL=quests.controller.js.map