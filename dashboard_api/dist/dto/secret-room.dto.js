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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeNamePreviewDto = exports.ModerationQueueStatusDto = exports.RoomInvitationDto = exports.UserRoomLimitDto = exports.RoomStatsDto = exports.RoomParticipantDto = exports.SecretRoomResponseDto = exports.ModerationActionDto = exports.VoiceNoteDto = exports.RoomReactionDto = exports.SendTokenTipDto = exports.InviteUserDto = exports.JoinRoomDto = exports.UpdateSecretRoomDto = exports.CreateSecretRoomDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const room_entity_1 = require("../entities/room.entity");
const fake_name_generator_service_1 = require("../services/fake-name-generator.service");
class CreateSecretRoomDto {
    name;
    description;
    type;
    isPrivate;
    maxParticipants;
    theme;
    enablePseudonyms;
    fakeNameTheme;
    expiresAt;
    xpMultiplier;
    settings;
    moderationSettings;
    metadata;
    moderatorIds;
}
exports.CreateSecretRoomDto = CreateSecretRoomDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateSecretRoomDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 500),
    __metadata("design:type", String)
], CreateSecretRoomDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(room_entity_1.RoomType),
    __metadata("design:type", String)
], CreateSecretRoomDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSecretRoomDto.prototype, "isPrivate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2),
    (0, class_validator_1.Max)(1000),
    __metadata("design:type", Number)
], CreateSecretRoomDto.prototype, "maxParticipants", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], CreateSecretRoomDto.prototype, "theme", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSecretRoomDto.prototype, "enablePseudonyms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['default', 'space', 'animals', 'colors', 'cyber', 'mythical']),
    __metadata("design:type", typeof (_a = typeof fake_name_generator_service_1.FakeNameTheme !== "undefined" && fake_name_generator_service_1.FakeNameTheme) === "function" ? _a : Object)
], CreateSecretRoomDto.prototype, "fakeNameTheme", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => new Date(value)),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateSecretRoomDto.prototype, "expiresAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateSecretRoomDto.prototype, "xpMultiplier", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateSecretRoomDto.prototype, "settings", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateSecretRoomDto.prototype, "moderationSettings", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateSecretRoomDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateSecretRoomDto.prototype, "moderatorIds", void 0);
class UpdateSecretRoomDto {
    name;
    description;
    isPrivate;
    maxParticipants;
    theme;
    enablePseudonyms;
    fakeNameTheme;
    expiresAt;
    status;
    xpMultiplier;
    settings;
    moderationSettings;
    metadata;
    moderatorIds;
}
exports.UpdateSecretRoomDto = UpdateSecretRoomDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], UpdateSecretRoomDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 500),
    __metadata("design:type", String)
], UpdateSecretRoomDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSecretRoomDto.prototype, "isPrivate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2),
    (0, class_validator_1.Max)(1000),
    __metadata("design:type", Number)
], UpdateSecretRoomDto.prototype, "maxParticipants", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], UpdateSecretRoomDto.prototype, "theme", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSecretRoomDto.prototype, "enablePseudonyms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['default', 'space', 'animals', 'colors', 'cyber', 'mythical']),
    __metadata("design:type", typeof (_b = typeof fake_name_generator_service_1.FakeNameTheme !== "undefined" && fake_name_generator_service_1.FakeNameTheme) === "function" ? _b : Object)
], UpdateSecretRoomDto.prototype, "fakeNameTheme", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => new Date(value)),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateSecretRoomDto.prototype, "expiresAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(room_entity_1.RoomStatus),
    __metadata("design:type", String)
], UpdateSecretRoomDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], UpdateSecretRoomDto.prototype, "xpMultiplier", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateSecretRoomDto.prototype, "settings", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateSecretRoomDto.prototype, "moderationSettings", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateSecretRoomDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateSecretRoomDto.prototype, "moderatorIds", void 0);
class JoinRoomDto {
    roomCode;
    usePseudonym;
    fakeNameTheme;
}
exports.JoinRoomDto = JoinRoomDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JoinRoomDto.prototype, "roomCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], JoinRoomDto.prototype, "usePseudonym", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['default', 'space', 'animals', 'colors', 'cyber', 'mythical']),
    __metadata("design:type", typeof (_c = typeof fake_name_generator_service_1.FakeNameTheme !== "undefined" && fake_name_generator_service_1.FakeNameTheme) === "function" ? _c : Object)
], JoinRoomDto.prototype, "fakeNameTheme", void 0);
class InviteUserDto {
    userId;
    message;
}
exports.InviteUserDto = InviteUserDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InviteUserDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 200),
    __metadata("design:type", String)
], InviteUserDto.prototype, "message", void 0);
class SendTokenTipDto {
    recipientUserId;
    amount;
    token;
    message;
    usePseudonym;
}
exports.SendTokenTipDto = SendTokenTipDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendTokenTipDto.prototype, "recipientUserId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], SendTokenTipDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 20),
    __metadata("design:type", String)
], SendTokenTipDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 200),
    __metadata("design:type", String)
], SendTokenTipDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SendTokenTipDto.prototype, "usePseudonym", void 0);
class RoomReactionDto {
    messageId;
    emoji;
}
exports.RoomReactionDto = RoomReactionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RoomReactionDto.prototype, "messageId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 10),
    __metadata("design:type", String)
], RoomReactionDto.prototype, "emoji", void 0);
class VoiceNoteDto {
    voiceNoteUrl;
    duration;
    transcript;
}
exports.VoiceNoteDto = VoiceNoteDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoiceNoteDto.prototype, "voiceNoteUrl", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(300),
    __metadata("design:type", Number)
], VoiceNoteDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 500),
    __metadata("design:type", String)
], VoiceNoteDto.prototype, "transcript", void 0);
class ModerationActionDto {
    targetUserId;
    action;
    reason;
    durationMinutes;
}
exports.ModerationActionDto = ModerationActionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModerationActionDto.prototype, "targetUserId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['warn', 'mute', 'kick', 'ban']),
    __metadata("design:type", String)
], ModerationActionDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 200),
    __metadata("design:type", String)
], ModerationActionDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ModerationActionDto.prototype, "durationMinutes", void 0);
class SecretRoomResponseDto {
    id;
    name;
    description;
    type;
    creatorId;
    roomCode;
    isPrivate;
    isActive;
    status;
    maxParticipants;
    currentUsers;
    theme;
    enablePseudonyms;
    fakeNameTheme;
    xpMultiplier;
    expiresAt;
    lastActivityAt;
    createdAt;
    updatedAt;
    moderationSettings;
    reactionMetrics;
    settings;
    metadata;
    moderatorIds;
}
exports.SecretRoomResponseDto = SecretRoomResponseDto;
class RoomParticipantDto {
    userId;
    pseudonym;
    joinedAt;
    role;
    isActive;
}
exports.RoomParticipantDto = RoomParticipantDto;
class RoomStatsDto {
    totalParticipants;
    activeParticipants;
    totalMessages;
    totalReactions;
    totalTokenTips;
    averageSessionDuration;
    trendingScore;
    moderationQueueLength;
}
exports.RoomStatsDto = RoomStatsDto;
class UserRoomLimitDto {
    currentRooms;
    maxRooms;
    canCreateMore;
}
exports.UserRoomLimitDto = UserRoomLimitDto;
class RoomInvitationDto {
    id;
    roomId;
    roomName;
    inviterId;
    inviterName;
    invitedUserId;
    message;
    status;
    createdAt;
    expiresAt;
}
exports.RoomInvitationDto = RoomInvitationDto;
class ModerationQueueStatusDto {
    totalItems;
    pendingItems;
    processingItems;
    queueCapacity;
    averageProcessingTime;
    yourPosition;
}
exports.ModerationQueueStatusDto = ModerationQueueStatusDto;
class FakeNamePreviewDto {
    theme;
    samples;
}
exports.FakeNamePreviewDto = FakeNamePreviewDto;
//# sourceMappingURL=secret-room.dto.js.map