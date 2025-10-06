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
exports.Room = exports.RoomStatus = exports.RoomType = void 0;
const typeorm_1 = require("typeorm");
const participant_entity_1 = require("./participant.entity");
const message_entity_1 = require("./message.entity");
const transaction_entity_1 = require("./transaction.entity");
var RoomType;
(function (RoomType) {
    RoomType["SECRET"] = "secret";
    RoomType["DEGEN"] = "degen";
    RoomType["VOICE_DROP"] = "voice_drop";
    RoomType["GATED"] = "gated";
})(RoomType || (exports.RoomType = RoomType = {}));
var RoomStatus;
(function (RoomStatus) {
    RoomStatus["ACTIVE"] = "active";
    RoomStatus["EXPIRED"] = "expired";
    RoomStatus["DELETED"] = "deleted";
    RoomStatus["SUSPENDED"] = "suspended";
})(RoomStatus || (exports.RoomStatus = RoomStatus = {}));
let Room = class Room {
    id;
    name;
    type;
    creatorId;
    expiresAt;
    maxParticipants;
    theme;
    accessRules;
    moderatorIds;
    pinnedMessageId;
    isClosed;
    activityLevel;
    status;
    enablePseudonyms;
    fakeNameTheme;
    xpMultiplier;
    settings;
    moderationSettings;
    reactionMetrics;
    roomCode;
    lastActivity;
    schedulerData;
    createdAt;
    updatedAt;
    participants;
    messages;
    transactions;
};
exports.Room = Room;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Room.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Room.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RoomType }),
    __metadata("design:type", String)
], Room.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Room.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Room.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 100 }),
    __metadata("design:type", Number)
], Room.prototype, "maxParticipants", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Room.prototype, "theme", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Room.prototype, "accessRules", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Room.prototype, "moderatorIds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Room.prototype, "pinnedMessageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Room.prototype, "isClosed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Room.prototype, "activityLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RoomStatus, default: RoomStatus.ACTIVE }),
    __metadata("design:type", String)
], Room.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Room.prototype, "enablePseudonyms", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Room.prototype, "fakeNameTheme", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 1.0 }),
    __metadata("design:type", Number)
], Room.prototype, "xpMultiplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Room.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Room.prototype, "moderationSettings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Room.prototype, "reactionMetrics", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Room.prototype, "roomCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Room.prototype, "lastActivity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Room.prototype, "schedulerData", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Room.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Room.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => participant_entity_1.Participant, participant => participant.room, { cascade: true }),
    __metadata("design:type", Array)
], Room.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, message => message.room, { cascade: true }),
    __metadata("design:type", Array)
], Room.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transaction_entity_1.Transaction, transaction => transaction.room, { cascade: true }),
    __metadata("design:type", Array)
], Room.prototype, "transactions", void 0);
exports.Room = Room = __decorate([
    (0, typeorm_1.Entity)('rooms')
], Room);
//# sourceMappingURL=room.entity.js.map