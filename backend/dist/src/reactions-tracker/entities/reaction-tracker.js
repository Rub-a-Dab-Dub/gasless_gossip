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
exports.ReactionTrack = void 0;
const typeorm_1 = require("typeorm");
let ReactionTrack = class ReactionTrack {
    id;
    messageId;
    totalCount;
    likeCount;
    loveCount;
    laughCount;
    angryCount;
    sadCount;
    createdAt;
    updatedAt;
};
exports.ReactionTrack = ReactionTrack;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReactionTrack.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'message_id', type: 'uuid' }),
    __metadata("design:type", String)
], ReactionTrack.prototype, "messageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_count', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], ReactionTrack.prototype, "totalCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'like_count', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], ReactionTrack.prototype, "likeCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'love_count', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], ReactionTrack.prototype, "loveCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'laugh_count', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], ReactionTrack.prototype, "laughCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'angry_count', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], ReactionTrack.prototype, "angryCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sad_count', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], ReactionTrack.prototype, "sadCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ReactionTrack.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ReactionTrack.prototype, "updatedAt", void 0);
exports.ReactionTrack = ReactionTrack = __decorate([
    (0, typeorm_1.Entity)('reaction_tracks'),
    (0, typeorm_1.Index)(['messageId'])
], ReactionTrack);
//# sourceMappingURL=reaction-tracker.js.map