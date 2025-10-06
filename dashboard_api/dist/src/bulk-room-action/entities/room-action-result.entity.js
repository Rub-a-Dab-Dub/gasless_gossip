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
exports.RoomActionResult = void 0;
const typeorm_1 = require("typeorm");
let RoomActionResult = class RoomActionResult {
    id;
    bulkActionId;
    bulkAction;
    roomId;
    status;
    previousState;
    newState;
    errorMessage;
    executionTimeMs;
    createdAt;
};
exports.RoomActionResult = RoomActionResult;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], RoomActionResult.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoomActionResult.prototype, "bulkActionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)("BulkAction"),
    (0, typeorm_1.JoinColumn)({ name: "bulkActionId" }),
    __metadata("design:type", Function)
], RoomActionResult.prototype, "bulkAction", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoomActionResult.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoomActionResult.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], RoomActionResult.prototype, "previousState", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], RoomActionResult.prototype, "newState", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], RoomActionResult.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], RoomActionResult.prototype, "executionTimeMs", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RoomActionResult.prototype, "createdAt", void 0);
exports.RoomActionResult = RoomActionResult = __decorate([
    (0, typeorm_1.Entity)("room_action_results")
], RoomActionResult);
//# sourceMappingURL=room-action-result.entity.js.map