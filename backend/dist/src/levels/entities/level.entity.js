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
exports.Level = void 0;
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
let Level = class Level {
    id;
    userId;
    user;
    level;
    currentXp;
    xpThreshold;
    totalXp;
    isLevelUpPending;
    createdAt;
    updatedAt;
};
exports.Level = Level;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Level.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], Level.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Level.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 1 }),
    __metadata("design:type", Number)
], Level.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_xp', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Level.prototype, "currentXp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'xp_threshold', type: 'integer' }),
    __metadata("design:type", Number)
], Level.prototype, "xpThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_xp', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Level.prototype, "totalXp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_level_up_pending', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Level.prototype, "isLevelUpPending", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Level.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Level.prototype, "updatedAt", void 0);
exports.Level = Level = __decorate([
    (0, typeorm_1.Entity)('levels'),
    (0, typeorm_1.Index)(['userId', 'level'], { unique: true })
], Level);
//# sourceMappingURL=level.entity.js.map