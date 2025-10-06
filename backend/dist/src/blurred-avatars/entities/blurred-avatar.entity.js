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
exports.BlurredAvatar = void 0;
const typeorm_1 = require("typeorm");
let BlurredAvatar = class BlurredAvatar {
    id;
    userId;
    blurLevel;
    imageUrl;
    originalImageUrl;
    isActive;
    createdAt;
    updatedAt;
};
exports.BlurredAvatar = BlurredAvatar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BlurredAvatar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], BlurredAvatar.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 5 }),
    __metadata("design:type", Number)
], BlurredAvatar.prototype, "blurLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: false }),
    __metadata("design:type", String)
], BlurredAvatar.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], BlurredAvatar.prototype, "originalImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], BlurredAvatar.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BlurredAvatar.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BlurredAvatar.prototype, "updatedAt", void 0);
exports.BlurredAvatar = BlurredAvatar = __decorate([
    (0, typeorm_1.Entity)('blurred_avatars'),
    (0, typeorm_1.Index)(['userId'], { unique: false })
], BlurredAvatar);
//# sourceMappingURL=blurred-avatar.entity.js.map