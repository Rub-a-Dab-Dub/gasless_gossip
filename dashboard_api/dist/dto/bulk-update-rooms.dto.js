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
exports.BulkUpdateRoomsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const update_room_dto_1 = require("./update-room.dto");
class BulkUpdateRoomsDto {
    roomIds;
    updates;
}
exports.BulkUpdateRoomsDto = BulkUpdateRoomsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BulkUpdateRoomsDto.prototype, "roomIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: update_room_dto_1.UpdateRoomDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => update_room_dto_1.UpdateRoomDto),
    __metadata("design:type", update_room_dto_1.UpdateRoomDto)
], BulkUpdateRoomsDto.prototype, "updates", void 0);
//# sourceMappingURL=bulk-update-rooms.dto.js.map