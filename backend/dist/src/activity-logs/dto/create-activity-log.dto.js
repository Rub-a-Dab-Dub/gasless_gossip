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
exports.CreateActivityLogDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const activity_log_entity_1 = require("../entities/activity-log.entity");
class CreateActivityLogDto {
    userId;
    action;
    metadata;
    roomId;
    targetUserId;
    amount;
    ipAddress;
    userAgent;
}
exports.CreateActivityLogDto = CreateActivityLogDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User ID performing the action" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateActivityLogDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: activity_log_entity_1.ActivityAction,
        description: "Type of action performed",
        example: activity_log_entity_1.ActivityAction.MESSAGE_SENT,
    }),
    (0, class_validator_1.IsEnum)(activity_log_entity_1.ActivityAction),
    __metadata("design:type", String)
], CreateActivityLogDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Additional metadata for the action",
        example: { messageId: "uuid", content: "Hello world" },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateActivityLogDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Room ID where action occurred" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActivityLogDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Target user ID for the action" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateActivityLogDto.prototype, "targetUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Amount involved in the action (e.g., tip amount)",
        example: 10.5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateActivityLogDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "IP address of the user" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIP)(),
    __metadata("design:type", String)
], CreateActivityLogDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "User agent string" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActivityLogDto.prototype, "userAgent", void 0);
//# sourceMappingURL=create-activity-log.dto.js.map