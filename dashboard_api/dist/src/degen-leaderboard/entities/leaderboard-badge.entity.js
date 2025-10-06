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
exports.LeaderboardBadge = void 0;
const typeorm_1 = require("typeorm");
let LeaderboardBadge = class LeaderboardBadge {
    id;
    userId;
    badgeType;
    badgeName;
    description;
    tier;
    iconUrl;
    awardedAt;
    awardedBy;
    criteria;
    isActive;
    createdAt;
    updatedAt;
};
exports.LeaderboardBadge = LeaderboardBadge;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], LeaderboardBadge.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], LeaderboardBadge.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], LeaderboardBadge.prototype, "badgeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], LeaderboardBadge.prototype, "badgeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], LeaderboardBadge.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], LeaderboardBadge.prototype, "tier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], LeaderboardBadge.prototype, "iconUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp" }),
    __metadata("design:type", Date)
], LeaderboardBadge.prototype, "awardedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], LeaderboardBadge.prototype, "awardedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], LeaderboardBadge.prototype, "criteria", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], LeaderboardBadge.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LeaderboardBadge.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], LeaderboardBadge.prototype, "updatedAt", void 0);
exports.LeaderboardBadge = LeaderboardBadge = __decorate([
    (0, typeorm_1.Entity)("leaderboard_badges"),
    (0, typeorm_1.Index)(["userId", "badgeType"])
], LeaderboardBadge);
//# sourceMappingURL=leaderboard-badge.entity.js.map