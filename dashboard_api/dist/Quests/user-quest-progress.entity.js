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
exports.UserQuestProgress = void 0;
let UserQuestProgress = class UserQuestProgress {
    id;
    userId;
    questId;
    currentProgress;
    targetCount;
    completed;
    completedAt;
    currentStreak;
    longestStreak;
    lastCompletionDate;
    activeMultiplier;
    multiplierExpiresAt;
    lastResetAt;
    createdAt;
    updatedAt;
    quest;
    completionAudits;
};
exports.UserQuestProgress = UserQuestProgress;
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], UserQuestProgress.prototype, "id", void 0);
__decorate([
    Column('uuid'),
    __metadata("design:type", String)
], UserQuestProgress.prototype, "userId", void 0);
__decorate([
    Column('uuid'),
    __metadata("design:type", String)
], UserQuestProgress.prototype, "questId", void 0);
__decorate([
    Column('int', { default: 0 }),
    __metadata("design:type", Number)
], UserQuestProgress.prototype, "currentProgress", void 0);
__decorate([
    Column('int', { default: 0 }),
    __metadata("design:type", Number)
], UserQuestProgress.prototype, "targetCount", void 0);
__decorate([
    Column('boolean', { default: false }),
    __metadata("design:type", Boolean)
], UserQuestProgress.prototype, "completed", void 0);
__decorate([
    Column('timestamp', { nullable: true }),
    __metadata("design:type", Date)
], UserQuestProgress.prototype, "completedAt", void 0);
__decorate([
    Column('int', { default: 0 }),
    __metadata("design:type", Number)
], UserQuestProgress.prototype, "currentStreak", void 0);
__decorate([
    Column('int', { default: 0 }),
    __metadata("design:type", Number)
], UserQuestProgress.prototype, "longestStreak", void 0);
__decorate([
    Column('date', { nullable: true }),
    __metadata("design:type", Date)
], UserQuestProgress.prototype, "lastCompletionDate", void 0);
__decorate([
    Column('decimal', { precision: 5, scale: 2, default: 1.0 }),
    __metadata("design:type", Number)
], UserQuestProgress.prototype, "activeMultiplier", void 0);
__decorate([
    Column('timestamp', { nullable: true }),
    __metadata("design:type", Date)
], UserQuestProgress.prototype, "multiplierExpiresAt", void 0);
__decorate([
    Column('timestamp'),
    __metadata("design:type", Date)
], UserQuestProgress.prototype, "lastResetAt", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], UserQuestProgress.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], UserQuestProgress.prototype, "updatedAt", void 0);
__decorate([
    ManyToOne(() => Quest, quest => quest.userProgress),
    JoinColumn({ name: 'questId' }),
    __metadata("design:type", typeof (_a = typeof Quest !== "undefined" && Quest) === "function" ? _a : Object)
], UserQuestProgress.prototype, "quest", void 0);
__decorate([
    OneToMany(() => QuestCompletionAudit, audit => audit.userProgress),
    __metadata("design:type", Array)
], UserQuestProgress.prototype, "completionAudits", void 0);
exports.UserQuestProgress = UserQuestProgress = __decorate([
    Entity('user_quest_progress')
], UserQuestProgress);
//# sourceMappingURL=user-quest-progress.entity.js.map