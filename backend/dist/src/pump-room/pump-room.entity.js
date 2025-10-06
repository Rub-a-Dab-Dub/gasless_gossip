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
exports.PumpRoom = void 0;
const typeorm_1 = require("typeorm");
let PumpRoom = class PumpRoom {
    id;
    roomId;
    predictions;
    votes;
    totalVotes;
    isActive;
    endDate;
    createdAt;
    updatedAt;
};
exports.PumpRoom = PumpRoom;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PumpRoom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], PumpRoom.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Array)
], PumpRoom.prototype, "predictions", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { default: {} }),
    __metadata("design:type", Object)
], PumpRoom.prototype, "votes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PumpRoom.prototype, "totalVotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], PumpRoom.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', { nullable: true }),
    __metadata("design:type", Date)
], PumpRoom.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PumpRoom.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PumpRoom.prototype, "updatedAt", void 0);
exports.PumpRoom = PumpRoom = __decorate([
    (0, typeorm_1.Entity)('pump_rooms')
], PumpRoom);
//# sourceMappingURL=pump-room.entity.js.map