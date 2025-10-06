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
exports.Quest = void 0;
const typeorm_1 = require("typeorm");
const quest_enums_1 = require("../enums/quest.enums");
let Quest = class Quest {
    id;
    title;
    description;
    type;
    status;
    taskDescription;
    targetCount;
    taskType;
    rewardType;
    rewardAmount;
    bonusTokens;
    supportsStreak;
    streakBonusXp;
    allowsFrenzyBoost;
    resetTime;
    startsAt;
    endsAt;
    createdAt;
    updatedAt;
    userProgress;
};
exports.Quest = Quest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Quest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Quest.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Quest.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: quest_enums_1.QuestType,
        default: quest_enums_1.QuestType.DAILY
    }),
    __metadata("design:type", String)
], Quest.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: quest_enums_1.QuestStatus,
        default: quest_enums_1.QuestStatus.ACTIVE
    }),
    __metadata("design:type", String)
], Quest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Quest.prototype, "taskDescription", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Quest.prototype, "targetCount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Quest.prototype, "taskType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: quest_enums_1.RewardType,
        default: quest_enums_1.RewardType.XP
    }),
    __metadata("design:type", String)
], Quest.prototype, "rewardType", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Quest.prototype, "rewardAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Quest.prototype, "bonusTokens", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { default: false }),
    __metadata("design:type", Boolean)
], Quest.prototype, "supportsStreak", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Quest.prototype, "streakBonusXp", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { default: true }),
    __metadata("design:type", Boolean)
], Quest.prototype, "allowsFrenzyBoost", void 0);
__decorate([
    (0, typeorm_1.Column)('time', { nullable: true }),
    __metadata("design:type", String)
], Quest.prototype, "resetTime", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', { nullable: true }),
    __metadata("design:type", Date)
], Quest.prototype, "startsAt", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', { nullable: true }),
    __metadata("design:type", Date)
], Quest.prototype, "endsAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Quest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Quest.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserQuestProgress, progress => progress.quest),
    __metadata("design:type", Array)
], Quest.prototype, "userProgress", void 0);
exports.Quest = Quest = __decorate([
    (0, typeorm_1.Entity)('quests')
], Quest);
//# sourceMappingURL=quest.entity.js.map