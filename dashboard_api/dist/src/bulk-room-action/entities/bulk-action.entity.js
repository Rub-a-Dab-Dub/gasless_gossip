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
exports.BulkAction = void 0;
const typeorm_1 = require("typeorm");
let BulkAction = class BulkAction {
    id;
    actionType;
    targetRoomIds;
    actionPayload;
    status;
    totalRooms;
    successCount;
    failureCount;
    errors;
    executedBy;
    executedAt;
    executionTimeMs;
    isDryRun;
    createdAt;
    updatedAt;
};
exports.BulkAction = BulkAction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], BulkAction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BulkAction.prototype, "actionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Array)
], BulkAction.prototype, "targetRoomIds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], BulkAction.prototype, "actionPayload", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BulkAction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], BulkAction.prototype, "totalRooms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], BulkAction.prototype, "successCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], BulkAction.prototype, "failureCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Array)
], BulkAction.prototype, "errors", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BulkAction.prototype, "executedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], BulkAction.prototype, "executedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], BulkAction.prototype, "executionTimeMs", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], BulkAction.prototype, "isDryRun", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BulkAction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BulkAction.prototype, "updatedAt", void 0);
exports.BulkAction = BulkAction = __decorate([
    (0, typeorm_1.Entity)("bulk_actions")
], BulkAction);
//# sourceMappingURL=bulk-action.entity.js.map