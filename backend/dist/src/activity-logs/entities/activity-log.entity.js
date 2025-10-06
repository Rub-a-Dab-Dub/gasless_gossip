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
exports.ActivityLog = exports.ActivityAction = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var ActivityAction;
(function (ActivityAction) {
    ActivityAction["MESSAGE_SENT"] = "message_sent";
    ActivityAction["MESSAGE_RECEIVED"] = "message_received";
    ActivityAction["TIP_SENT"] = "tip_sent";
    ActivityAction["TIP_RECEIVED"] = "tip_received";
    ActivityAction["ROOM_JOINED"] = "room_joined";
    ActivityAction["ROOM_LEFT"] = "room_left";
    ActivityAction["PROFILE_UPDATED"] = "profile_updated";
    ActivityAction["BADGE_EARNED"] = "badge_earned";
    ActivityAction["LEVEL_UP"] = "level_up";
    ActivityAction["NFT_MINTED"] = "nft_minted";
    ActivityAction["NFT_TRANSFERRED"] = "nft_transferred";
    ActivityAction["LOGIN"] = "login";
    ActivityAction["LOGOUT"] = "logout";
})(ActivityAction || (exports.ActivityAction = ActivityAction = {}));
let ActivityLog = class ActivityLog {
    id;
    userId;
    action;
    metadata;
    roomId;
    targetUserId;
    amount;
    ipAddress;
    userAgent;
    createdAt;
    user;
    targetUser;
};
exports.ActivityLog = ActivityLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ActivityLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid"),
    __metadata("design:type", String)
], ActivityLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ActivityAction,
    }),
    __metadata("design:type", String)
], ActivityLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { nullable: true }),
    __metadata("design:type", Object)
], ActivityLog.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "targetUserId", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], ActivityLog.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ActivityLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", user_entity_1.User)
], ActivityLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "targetUserId" }),
    __metadata("design:type", user_entity_1.User)
], ActivityLog.prototype, "targetUser", void 0);
exports.ActivityLog = ActivityLog = __decorate([
    (0, typeorm_1.Entity)("activity_logs"),
    (0, typeorm_1.Index)(["userId", "createdAt"]),
    (0, typeorm_1.Index)(["action", "createdAt"])
], ActivityLog);
//# sourceMappingURL=activity-log.entity.js.map