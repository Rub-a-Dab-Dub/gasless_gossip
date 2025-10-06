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
exports.Pseudonym = void 0;
const typeorm_1 = require("typeorm");
let Pseudonym = class Pseudonym {
    id;
    roomId;
    userId;
    pseudonym;
    createdAt;
    updatedAt;
};
exports.Pseudonym = Pseudonym;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Pseudonym.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'room_id', type: 'uuid' }),
    (0, typeorm_1.Index)('idx_pseudonyms_room_id'),
    __metadata("design:type", String)
], Pseudonym.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    (0, typeorm_1.Index)('idx_pseudonyms_user_id'),
    __metadata("design:type", String)
], Pseudonym.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Pseudonym.prototype, "pseudonym", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Pseudonym.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Pseudonym.prototype, "updatedAt", void 0);
exports.Pseudonym = Pseudonym = __decorate([
    (0, typeorm_1.Entity)('pseudonyms'),
    (0, typeorm_1.Unique)('uq_room_user', ['roomId', 'userId']),
    (0, typeorm_1.Unique)('uq_room_pseudonym', ['roomId', 'pseudonym'])
], Pseudonym);
//# sourceMappingURL=pseudonym.entity.js.map