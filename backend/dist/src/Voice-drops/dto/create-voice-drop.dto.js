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
exports.CreateVoiceDropDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateVoiceDropDto {
    roomId;
    duration;
    fileSize;
    fileName;
    mimeType;
}
exports.CreateVoiceDropDto = CreateVoiceDropDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Room ID where the voice note will be shared' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVoiceDropDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Duration in seconds', minimum: 1, maximum: 300 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(300),
    __metadata("design:type", Number)
], CreateVoiceDropDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File size in bytes' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateVoiceDropDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Original filename' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVoiceDropDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'MIME type', example: 'audio/mpeg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^audio\/(mpeg|wav|ogg|mp4|webm|aac)$/),
    __metadata("design:type", String)
], CreateVoiceDropDto.prototype, "mimeType", void 0);
//# sourceMappingURL=create-voice-drop.dto.js.map