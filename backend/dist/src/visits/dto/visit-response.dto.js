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
exports.VisitResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class VisitResponseDto {
    id;
    roomId;
    userId;
    createdAt;
    duration;
    user;
}
exports.VisitResponseDto = VisitResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Visit identifier",
        example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    __metadata("design:type", String)
], VisitResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Room identifier",
        example: "room-123",
    }),
    __metadata("design:type", String)
], VisitResponseDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User identifier",
        example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    __metadata("design:type", String)
], VisitResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Visit timestamp",
        example: "2024-01-15T10:30:00Z",
    }),
    __metadata("design:type", Date)
], VisitResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Visit duration in seconds",
        example: 300,
    }),
    __metadata("design:type", Number)
], VisitResponseDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User information",
        required: false,
    }),
    __metadata("design:type", Object)
], VisitResponseDto.prototype, "user", void 0);
//# sourceMappingURL=visit-response.dto.js.map