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
exports.RoomMembership = exports.MembershipRole = void 0;
const typeorm_1 = require("typeorm");
const room_entity_1 = require("./room.entity");
var MembershipRole;
(function (MembershipRole) {
    MembershipRole["MEMBER"] = "member";
    MembershipRole["ADMIN"] = "admin";
    MembershipRole["OWNER"] = "owner";
})(MembershipRole || (exports.MembershipRole = MembershipRole = {}));
let RoomMembership = class RoomMembership {
    id;
    roomId;
    userId;
    role;
    invitedBy;
    isActive;
    room;
    joinedAt;
};
exports.RoomMembership = RoomMembership;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RoomMembership.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'room_id' }),
    __metadata("design:type", String)
], RoomMembership.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], RoomMembership.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MembershipRole,
        default: MembershipRole.MEMBER,
    }),
    __metadata("design:type", String)
], RoomMembership.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invited_by', nullable: true }),
    __metadata("design:type", String)
], RoomMembership.prototype, "invitedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], RoomMembership.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room, (room) => room.memberships),
    (0, typeorm_1.JoinColumn)({ name: 'room_id' }),
    __metadata("design:type", room_entity_1.Room)
], RoomMembership.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'joined_at' }),
    __metadata("design:type", Date)
], RoomMembership.prototype, "joinedAt", void 0);
exports.RoomMembership = RoomMembership = __decorate([
    (0, typeorm_1.Entity)('room_memberships')
], RoomMembership);
//# sourceMappingURL=room-membership.entity.js.map