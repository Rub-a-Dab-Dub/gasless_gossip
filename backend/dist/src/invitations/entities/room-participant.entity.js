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
exports.RoomParticipant = exports.ParticipantStatus = exports.ParticipantRole = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var ParticipantRole;
(function (ParticipantRole) {
    ParticipantRole["OWNER"] = "owner";
    ParticipantRole["ADMIN"] = "admin";
    ParticipantRole["MEMBER"] = "member";
    ParticipantRole["GUEST"] = "guest";
})(ParticipantRole || (exports.ParticipantRole = ParticipantRole = {}));
var ParticipantStatus;
(function (ParticipantStatus) {
    ParticipantStatus["ACTIVE"] = "active";
    ParticipantStatus["INACTIVE"] = "inactive";
    ParticipantStatus["BANNED"] = "banned";
    ParticipantStatus["LEFT"] = "left";
})(ParticipantStatus || (exports.ParticipantStatus = ParticipantStatus = {}));
let RoomParticipant = class RoomParticipant {
    id;
    roomId;
    userId;
    role;
    status;
    invitationId;
    joinedAt;
    lastActiveAt;
    permissions;
    user;
    createdAt;
    get isActive() {
        return this.status === ParticipantStatus.ACTIVE;
    }
    get canInvite() {
        return (this.role === ParticipantRole.OWNER ||
            this.role === ParticipantRole.ADMIN ||
            (this.permissions?.canInvite ?? false));
    }
    get canManage() {
        return this.role === ParticipantRole.OWNER || this.role === ParticipantRole.ADMIN;
    }
};
exports.RoomParticipant = RoomParticipant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], RoomParticipant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], RoomParticipant.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], RoomParticipant.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ParticipantRole, default: ParticipantRole.MEMBER }),
    __metadata("design:type", String)
], RoomParticipant.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ParticipantStatus, default: ParticipantStatus.ACTIVE }),
    __metadata("design:type", String)
], RoomParticipant.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], RoomParticipant.prototype, "invitationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], RoomParticipant.prototype, "joinedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], RoomParticipant.prototype, "lastActiveAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], RoomParticipant.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", user_entity_1.User)
], RoomParticipant.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RoomParticipant.prototype, "createdAt", void 0);
exports.RoomParticipant = RoomParticipant = __decorate([
    (0, typeorm_1.Entity)("room_participants"),
    (0, typeorm_1.Index)(["roomId", "userId"], { unique: true }),
    (0, typeorm_1.Index)(["roomId", "role"]),
    (0, typeorm_1.Index)(["userId", "status"])
], RoomParticipant);
//# sourceMappingURL=room-participant.entity.js.map