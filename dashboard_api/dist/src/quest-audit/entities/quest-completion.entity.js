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
exports.QuestCompletion = void 0;
const typeorm_1 = require("typeorm");
let QuestCompletion = class QuestCompletion {
    id;
    userId;
    questId;
    questName;
    rewardAmount;
    rewardType;
    completedAt;
    metadata;
    ipAddress;
    userAgent;
    isFlagged;
    isReversed;
    reverseReason;
    reversedBy;
    reversedAt;
    createdAt;
    updatedAt;
};
exports.QuestCompletion = QuestCompletion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], QuestCompletion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], QuestCompletion.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], QuestCompletion.prototype, "questId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], QuestCompletion.prototype, "questName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], QuestCompletion.prototype, "rewardAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], QuestCompletion.prototype, "rewardType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp" }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], QuestCompletion.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], QuestCompletion.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], QuestCompletion.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], QuestCompletion.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], QuestCompletion.prototype, "isFlagged", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], QuestCompletion.prototype, "isReversed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], QuestCompletion.prototype, "reverseReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], QuestCompletion.prototype, "reversedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], QuestCompletion.prototype, "reversedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], QuestCompletion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], QuestCompletion.prototype, "updatedAt", void 0);
exports.QuestCompletion = QuestCompletion = __decorate([
    (0, typeorm_1.Entity)("quest_completions"),
    (0, typeorm_1.Index)(["userId", "questId", "completedAt"]),
    (0, typeorm_1.Index)(["questId", "completedAt"])
], QuestCompletion);
//# sourceMappingURL=quest-completion.entity.js.map