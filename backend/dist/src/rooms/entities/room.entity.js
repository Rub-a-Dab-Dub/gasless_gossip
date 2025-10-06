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
exports.Room = exports.RoomType = void 0;
const typeorm_1 = require("typeorm");
const room_membership_entity_1 = require("./room-membership.entity");
var RoomType;
(function (RoomType) {
    RoomType["PUBLIC"] = "public";
    RoomType["PRIVATE"] = "private";
    RoomType["INVITE_ONLY"] = "invite_only";
})(RoomType || (exports.RoomType = RoomType = {}));
let Room = class Room {
    id;
    name;
    description;
    type;
    maxMembers;
    createdBy;
    isActive;
    minLevel;
    minXp;
    memberships;
    createdAt;
    updatedAt;
};
exports.Room = Room;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Room.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 100 }),
    __metadata("design:type", String)
], Room.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], Room.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RoomType,
        default: RoomType.PUBLIC,
    }),
    __metadata("design:type", String)
], Room.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_members', default: 100 }),
    __metadata("design:type", Number)
], Room.prototype, "maxMembers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by' }),
    __metadata("design:type", String)
], Room.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Room.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_level', default: 1 }),
    __metadata("design:type", Number)
], Room.prototype, "minLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_xp', default: 0 }),
    __metadata("design:type", Number)
], Room.prototype, "minXp", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => room_membership_entity_1.RoomMembership, (membership) => membership.room),
    __metadata("design:type", Array)
], Room.prototype, "memberships", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Room.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Room.prototype, "updatedAt", void 0);
exports.Room = Room = __decorate([
    (0, typeorm_1.Entity)('rooms')
], Room);
//# sourceMappingURL=room.entity.js.map