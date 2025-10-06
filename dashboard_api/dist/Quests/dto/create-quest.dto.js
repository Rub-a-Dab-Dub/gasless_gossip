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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateQuestDto = void 0;
const class_validator_1 = require("class-validator");
class CreateQuestDto {
    title;
    description;
    type;
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
}
exports.CreateQuestDto = CreateQuestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuestDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuestDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(QuestType),
    __metadata("design:type", typeof (_a = typeof QuestType !== "undefined" && QuestType) === "function" ? _a : Object)
], CreateQuestDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuestDto.prototype, "taskDescription", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateQuestDto.prototype, "targetCount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuestDto.prototype, "taskType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(RewardType),
    __metadata("design:type", typeof (_b = typeof RewardType !== "undefined" && RewardType) === "function" ? _b : Object)
], CreateQuestDto.prototype, "rewardType", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateQuestDto.prototype, "rewardAmount", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateQuestDto.prototype, "bonusTokens", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateQuestDto.prototype, "supportsStreak", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateQuestDto.prototype, "streakBonusXp", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateQuestDto.prototype, "allowsFrenzyBoost", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuestDto.prototype, "resetTime", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateQuestDto.prototype, "startsAt", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateQuestDto.prototype, "endsAt", void 0);
//# sourceMappingURL=create-quest.dto.js.map