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
exports.ActivityLogResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const activity_log_entity_1 = require("../entities/activity-log.entity");
class ActivityLogResponseDto {
    id;
    userId;
    action;
    metadata;
    roomId;
    targetUserId;
    amount;
    createdAt;
    user;
    targetUser;
}
exports.ActivityLogResponseDto = ActivityLogResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Activity log ID" }),
    __metadata("design:type", String)
], ActivityLogResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User ID who performed the action" }),
    __metadata("design:type", String)
], ActivityLogResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: activity_log_entity_1.ActivityAction,
        description: "Type of action performed",
    }),
    __metadata("design:type", String)
], ActivityLogResponseDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Additional metadata for the action" }),
    __metadata("design:type", Object)
], ActivityLogResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Room ID where action occurred" }),
    __metadata("design:type", String)
], ActivityLogResponseDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Target user ID for the action" }),
    __metadata("design:type", String)
], ActivityLogResponseDto.prototype, "targetUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Amount involved in the action" }),
    __metadata("design:type", Number)
], ActivityLogResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Timestamp when action was performed" }),
    __metadata("design:type", Date)
], ActivityLogResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "User information" }),
    __metadata("design:type", Object)
], ActivityLogResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Target user information" }),
    __metadata("design:type", Object)
], ActivityLogResponseDto.prototype, "targetUser", void 0);
//# sourceMappingURL=activity-log-response.dto.js.map