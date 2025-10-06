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
exports.PodcastRoomResponseDto = exports.UpdatePodcastRoomDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_podcast_room_dto_1 = require("./create-podcast-room.dto");
class UpdatePodcastRoomDto extends (0, mapped_types_1.PartialType)((0, mapped_types_1.OmitType)(create_podcast_room_dto_1.CreatePodcastRoomDto, ['roomId', 'audioHash', 'creatorId'])) {
}
exports.UpdatePodcastRoomDto = UpdatePodcastRoomDto;
const class_transformer_1 = require("class-transformer");
class PodcastRoomResponseDto {
    id;
    roomId;
    audioHash;
    creatorId;
    title;
    description;
    duration;
    audioFormat;
    fileSize;
    stellarHash;
    ipfsHash;
    isActive;
    tags;
    createdAt;
    updatedAt;
}
exports.PodcastRoomResponseDto = PodcastRoomResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PodcastRoomResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PodcastRoomResponseDto.prototype, "roomId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PodcastRoomResponseDto.prototype, "audioHash", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PodcastRoomResponseDto.prototype, "creatorId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PodcastRoomResponseDto.prototype, "title", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PodcastRoomResponseDto.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PodcastRoomResponseDto.prototype, "duration", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PodcastRoomResponseDto.prototype, "audioFormat", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PodcastRoomResponseDto.prototype, "fileSize", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PodcastRoomResponseDto.prototype, "stellarHash", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PodcastRoomResponseDto.prototype, "ipfsHash", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], PodcastRoomResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], PodcastRoomResponseDto.prototype, "tags", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], PodcastRoomResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], PodcastRoomResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=update-podcast-room.dto.js.map