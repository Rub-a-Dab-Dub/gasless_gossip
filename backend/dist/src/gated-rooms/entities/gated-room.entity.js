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
exports.GatedRoom = void 0;
const typeorm_1 = require("typeorm");
let GatedRoom = class GatedRoom {
    id;
    roomId;
    gateRules;
    roomName;
    description;
    createdBy;
    isActive;
    createdAt;
    updatedAt;
};
exports.GatedRoom = GatedRoom;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GatedRoom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'room_id', unique: true }),
    __metadata("design:type", String)
], GatedRoom.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'gate_rules' }),
    __metadata("design:type", Array)
], GatedRoom.prototype, "gateRules", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'room_name', nullable: true }),
    __metadata("design:type", String)
], GatedRoom.prototype, "roomName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', nullable: true }),
    __metadata("design:type", String)
], GatedRoom.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by' }),
    __metadata("design:type", String)
], GatedRoom.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], GatedRoom.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], GatedRoom.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], GatedRoom.prototype, "updatedAt", void 0);
exports.GatedRoom = GatedRoom = __decorate([
    (0, typeorm_1.Entity)('gated_rooms')
], GatedRoom);
//# sourceMappingURL=gated-room.entity.js.map