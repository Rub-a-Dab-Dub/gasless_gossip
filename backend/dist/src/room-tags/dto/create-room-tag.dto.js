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
exports.CreateMultipleRoomTagsDto = exports.CreateRoomTagDto = void 0;
const class_validator_1 = require("class-validator");
class CreateRoomTagDto {
    roomId;
    tagName;
}
exports.CreateRoomTagDto = CreateRoomTagDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRoomTagDto.prototype, "roomId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9_-]+$/, {
        message: 'Tag name can only contain letters, numbers, underscores, and hyphens',
    }),
    __metadata("design:type", String)
], CreateRoomTagDto.prototype, "tagName", void 0);
class CreateMultipleRoomTagsDto {
    roomId;
    tagNames;
}
exports.CreateMultipleRoomTagsDto = CreateMultipleRoomTagsDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateMultipleRoomTagsDto.prototype, "roomId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(10),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.Length)(1, 50, { each: true }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9_-]+$/, {
        each: true,
        message: 'Each tag name can only contain letters, numbers, underscores, and hyphens',
    }),
    __metadata("design:type", Array)
], CreateMultipleRoomTagsDto.prototype, "tagNames", void 0);
//# sourceMappingURL=create-room-tag.dto.js.map