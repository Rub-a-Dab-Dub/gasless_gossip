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
exports.UserRoomLimitDto = exports.RoomStatsDto = exports.RoomInvitationDto = exports.RoomMemberDto = exports.SecretRoomDto = exports.InviteUserDto = exports.JoinRoomDto = exports.UpdateSecretRoomDto = exports.CreateSecretRoomDto = void 0;
const class_validator_1 = require("class-validator");
class CreateSecretRoomDto {
    name;
    description;
    isPrivate;
    maxUsers;
    category;
    theme;
    settings;
    metadata;
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
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSecretRoomDto.prototype, "isPrivate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2),
    (0, class_validator_1.Max)(1000),
    __metadata("design:type", Number)
], CreateSecretRoomDto.prototype, "maxUsers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], CreateSecretRoomDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 20),
    __metadata("design:type", String)
], CreateSecretRoomDto.prototype, "theme", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSecretRoomDto.prototype, "settings", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSecretRoomDto.prototype, "metadata", void 0);
class UpdateSecretRoomDto {
    name;
    description;
    isPrivate;
    maxUsers;
    category;
    theme;
    settings;
    metadata;
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
], UpdateSecretRoomDto.prototype, "maxUsers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], UpdateSecretRoomDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 20),
    __metadata("design:type", String)
], UpdateSecretRoomDto.prototype, "theme", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateSecretRoomDto.prototype, "settings", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateSecretRoomDto.prototype, "metadata", void 0);
class JoinRoomDto {
    roomCode;
    nickname;
    isAnonymous;
}
exports.JoinRoomDto = JoinRoomDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 20),
    __metadata("design:type", String)
], JoinRoomDto.prototype, "roomCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], JoinRoomDto.prototype, "nickname", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], JoinRoomDto.prototype, "isAnonymous", void 0);
class InviteUserDto {
    email;
    userId;
    message;
    role;
    expiresInDays;
}
exports.InviteUserDto = InviteUserDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    __metadata("design:type", String)
], InviteUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], InviteUserDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 500),
    __metadata("design:type", String)
], InviteUserDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['member', 'moderator', 'admin']),
    __metadata("design:type", String)
], InviteUserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(30),
    __metadata("design:type", Number)
], InviteUserDto.prototype, "expiresInDays", void 0);
class SecretRoomDto {
    id;
    creatorId;
    name;
    description;
    roomCode;
    isPrivate;
    isActive;
    status;
    maxUsers;
    currentUsers;
    category;
    theme;
    settings;
    metadata;
    lastActivityAt;
    expiresAt;
    createdAt;
    updatedAt;
}
exports.SecretRoomDto = SecretRoomDto;
class RoomMemberDto {
    id;
    roomId;
    userId;
    role;
    status;
    nickname;
    displayName;
    isAnonymous;
    canInvite;
    canModerate;
    messageCount;
    reactionCount;
    lastSeenAt;
    lastMessageAt;
    permissions;
    metadata;
    joinedAt;
    updatedAt;
}
exports.RoomMemberDto = RoomMemberDto;
class RoomInvitationDto {
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
}
exports.RoomInvitationDto = RoomInvitationDto;
class RoomStatsDto {
    totalRooms;
    activeRooms;
    privateRooms;
    publicRooms;
    totalMembers;
    averageMembersPerRoom;
    roomsCreatedToday;
    roomsCreatedThisWeek;
}
exports.RoomStatsDto = RoomStatsDto;
class UserRoomLimitDto {
    userId;
    currentRooms;
    maxRooms;
    canCreateMore;
    remainingSlots;
}
exports.UserRoomLimitDto = UserRoomLimitDto;
//# sourceMappingURL=secret-room.dto.js.map