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
exports.RoomInvitation = void 0;
const typeorm_1 = require("typeorm");
let RoomInvitation = class RoomInvitation {
    id;
    roomId;
    invitedBy;
    invitedUserId;
    invitedEmail;
    invitationCode;
    status;
    message;
    role;
    expiresInDays;
    expiresAt;
    acceptedAt;
    declinedAt;
    metadata;
    createdAt;
};
exports.RoomInvitation = RoomInvitation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RoomInvitation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], RoomInvitation.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], RoomInvitation.prototype, "invitedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], RoomInvitation.prototype, "invitedUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], RoomInvitation.prototype, "invitedEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], RoomInvitation.prototype, "invitationCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['pending', 'accepted', 'declined', 'expired', 'revoked'],
        default: 'pending'
    }),
    __metadata("design:type", String)
], RoomInvitation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RoomInvitation.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], RoomInvitation.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 7 }),
    __metadata("design:type", Number)
], RoomInvitation.prototype, "expiresInDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], RoomInvitation.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], RoomInvitation.prototype, "acceptedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], RoomInvitation.prototype, "declinedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], RoomInvitation.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RoomInvitation.prototype, "createdAt", void 0);
exports.RoomInvitation = RoomInvitation = __decorate([
    (0, typeorm_1.Entity)('room_invitations'),
    (0, typeorm_1.Index)(['roomId', 'createdAt']),
    (0, typeorm_1.Index)(['invitedUserId', 'status']),
    (0, typeorm_1.Index)(['invitedBy', 'createdAt']),
    (0, typeorm_1.Index)(['invitationCode', 'status'])
], RoomInvitation);
//# sourceMappingURL=room-invitation.entity.js.map