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
exports.GossipBroadcastDto = exports.GossipUpdateDto = exports.GossipIntentDto = exports.CommentGossipDto = exports.VoteGossipDto = exports.UpdateGossipIntentDto = exports.CreateGossipIntentDto = void 0;
const class_validator_1 = require("class-validator");
class CreateGossipIntentDto {
    roomId;
    content;
    metadata;
    expiresInMinutes;
}
exports.CreateGossipIntentDto = CreateGossipIntentDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateGossipIntentDto.prototype, "roomId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGossipIntentDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateGossipIntentDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1440),
    __metadata("design:type", Number)
], CreateGossipIntentDto.prototype, "expiresInMinutes", void 0);
class UpdateGossipIntentDto {
    intentId;
    status;
    reason;
}
exports.UpdateGossipIntentDto = UpdateGossipIntentDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateGossipIntentDto.prototype, "intentId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['pending', 'verified', 'debunked', 'expired']),
    __metadata("design:type", String)
], UpdateGossipIntentDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGossipIntentDto.prototype, "reason", void 0);
class VoteGossipDto {
    intentId;
    action;
}
exports.VoteGossipDto = VoteGossipDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], VoteGossipDto.prototype, "intentId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['upvote', 'downvote', 'remove']),
    __metadata("design:type", String)
], VoteGossipDto.prototype, "action", void 0);
class CommentGossipDto {
    intentId;
    content;
}
exports.CommentGossipDto = CommentGossipDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CommentGossipDto.prototype, "intentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CommentGossipDto.prototype, "content", void 0);
class GossipIntentDto {
    id;
    roomId;
    userId;
    content;
    status;
    metadata;
    upvotes;
    downvotes;
    expiresAt;
    createdAt;
    updatedAt;
}
exports.GossipIntentDto = GossipIntentDto;
class GossipUpdateDto {
    id;
    intentId;
    userId;
    type;
    content;
    metadata;
    createdAt;
}
exports.GossipUpdateDto = GossipUpdateDto;
class GossipBroadcastDto {
    type;
    intent;
    update;
    timestamp;
    roomId;
}
exports.GossipBroadcastDto = GossipBroadcastDto;
//# sourceMappingURL=gossip.dto.js.map