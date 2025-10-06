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
exports.CreateRoomDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const room_entity_1 = require("../entities/room.entity");
class CreateRoomDto {
    name;
    type;
    expiresAt;
    maxParticipants;
    theme;
    moderatorIds;
    accessRules;
}
exports.CreateRoomDto = CreateRoomDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Secret Gossip Room' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: room_entity_1.RoomType, example: room_entity_1.RoomType.SECRET }),
    (0, class_validator_1.IsEnum)(room_entity_1.RoomType),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: '2025-10-30T23:59:59Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "maxParticipants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'dimly lit' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "theme", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: [String], example: ['mod-user-id-1'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateRoomDto.prototype, "moderatorIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: 'object' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateRoomDto.prototype, "accessRules", void 0);
//# sourceMappingURL=create-room.dto.js.map