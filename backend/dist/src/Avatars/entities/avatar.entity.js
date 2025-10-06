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
exports.CreateAvatarDto = exports.AttributeDto = exports.Avatar = void 0;
const typeorm_1 = require("typeorm");
let Avatar = class Avatar {
    id;
    userId;
    metadata;
    txId;
    stellarAssetCode;
    stellarIssuer;
    isActive;
    createdAt;
    updatedAt;
};
exports.Avatar = Avatar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Avatar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Avatar.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], Avatar.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Avatar.prototype, "txId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 56 }),
    __metadata("design:type", String)
], Avatar.prototype, "stellarAssetCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 56 }),
    __metadata("design:type", String)
], Avatar.prototype, "stellarIssuer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Avatar.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Avatar.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Avatar.prototype, "updatedAt", void 0);
exports.Avatar = Avatar = __decorate([
    (0, typeorm_1.Entity)('avatars'),
    (0, typeorm_1.Index)(['userId'], { unique: true })
], Avatar);
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AttributeDto {
    trait_type;
    value;
}
exports.AttributeDto = AttributeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AttributeDto.prototype, "trait_type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], AttributeDto.prototype, "value", void 0);
class CreateAvatarDto {
    name;
    description;
    image;
    level;
    rarity;
    attributes;
}
exports.CreateAvatarDto = CreateAvatarDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAvatarDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAvatarDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateAvatarDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateAvatarDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['common', 'rare', 'epic', 'legendary']),
    __metadata("design:type", String)
], CreateAvatarDto.prototype, "rarity", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AttributeDto),
    __metadata("design:type", Array)
], CreateAvatarDto.prototype, "attributes", void 0);
//# sourceMappingURL=avatar.entity.js.map