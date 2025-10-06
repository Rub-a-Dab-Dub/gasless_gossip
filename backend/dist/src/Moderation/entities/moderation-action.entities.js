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
exports.ModerationAction = exports.ActionType = void 0;
const typeorm_1 = require("typeorm");
var ActionType;
(function (ActionType) {
    ActionType["BAN"] = "ban";
    ActionType["KICK"] = "kick";
    ActionType["UNBAN"] = "unban";
    ActionType["MUTE"] = "mute";
    ActionType["UNMUTE"] = "unmute";
    ActionType["WARN"] = "warn";
})(ActionType || (exports.ActionType = ActionType = {}));
let ModerationAction = class ModerationAction {
    id;
    roomId;
    targetId;
    moderatorId;
    actionType;
    reason;
    expiresAt;
    isActive;
    createdAt;
    updatedAt;
};
exports.ModerationAction = ModerationAction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ModerationAction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], ModerationAction.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], ModerationAction.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], ModerationAction.prototype, "moderatorId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ActionType,
    }),
    __metadata("design:type", String)
], ModerationAction.prototype, "actionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ModerationAction.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ModerationAction.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ModerationAction.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ModerationAction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ModerationAction.prototype, "updatedAt", void 0);
exports.ModerationAction = ModerationAction = __decorate([
    (0, typeorm_1.Entity)('moderation_actions')
], ModerationAction);
//# sourceMappingURL=moderation-action.entities.js.map