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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestCompletionAudit = void 0;
let QuestCompletionAudit = class QuestCompletionAudit {
    id;
    userId;
    questId;
    progressId;
    progressSnapshot;
    streakSnapshot;
    multiplierApplied;
    xpAwarded;
    tokensAwarded;
    metadata;
    completedAt;
    userProgress;
};
exports.QuestCompletionAudit = QuestCompletionAudit;
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], QuestCompletionAudit.prototype, "id", void 0);
__decorate([
    Column('uuid'),
    __metadata("design:type", String)
], QuestCompletionAudit.prototype, "userId", void 0);
__decorate([
    Column('uuid'),
    __metadata("design:type", String)
], QuestCompletionAudit.prototype, "questId", void 0);
__decorate([
    Column('uuid'),
    __metadata("design:type", String)
], QuestCompletionAudit.prototype, "progressId", void 0);
__decorate([
    Column('int'),
    __metadata("design:type", Number)
], QuestCompletionAudit.prototype, "progressSnapshot", void 0);
__decorate([
    Column('int'),
    __metadata("design:type", Number)
], QuestCompletionAudit.prototype, "streakSnapshot", void 0);
__decorate([
    Column('decimal', { precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], QuestCompletionAudit.prototype, "multiplierApplied", void 0);
__decorate([
    Column('int'),
    __metadata("design:type", Number)
], QuestCompletionAudit.prototype, "xpAwarded", void 0);
__decorate([
    Column('int'),
    __metadata("design:type", Number)
], QuestCompletionAudit.prototype, "tokensAwarded", void 0);
__decorate([
    Column('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], QuestCompletionAudit.prototype, "metadata", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], QuestCompletionAudit.prototype, "completedAt", void 0);
__decorate([
    ManyToOne(() => UserQuestProgress, progress => progress.completionAudits),
    JoinColumn({ name: 'progressId' }),
    __metadata("design:type", typeof (_a = typeof UserQuestProgress !== "undefined" && UserQuestProgress) === "function" ? _a : Object)
], QuestCompletionAudit.prototype, "userProgress", void 0);
exports.QuestCompletionAudit = QuestCompletionAudit = __decorate([
    Entity('quest_completion_audits')
], QuestCompletionAudit);
//# sourceMappingURL=quest-completion-audit.entity.js.map