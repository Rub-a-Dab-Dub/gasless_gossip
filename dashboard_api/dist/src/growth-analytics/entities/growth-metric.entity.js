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
exports.GrowthMetric = void 0;
const typeorm_1 = require("typeorm");
let GrowthMetric = class GrowthMetric {
    id;
    userId;
    cohortId;
    metricDate;
    userLevel;
    unlocksCount;
    dropOffPoint;
    isActive;
    sessionDuration;
    createdAt;
    updatedAt;
};
exports.GrowthMetric = GrowthMetric;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], GrowthMetric.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_id", type: "uuid" }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], GrowthMetric.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "cohort_id", type: "varchar", nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], GrowthMetric.prototype, "cohortId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "metric_date", type: "date" }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], GrowthMetric.prototype, "metricDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_level", type: "integer", default: 0 }),
    __metadata("design:type", Number)
], GrowthMetric.prototype, "userLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "unlocks_count", type: "integer", default: 0 }),
    __metadata("design:type", Number)
], GrowthMetric.prototype, "unlocksCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "drop_off_point", type: "integer", nullable: true }),
    __metadata("design:type", Number)
], GrowthMetric.prototype, "dropOffPoint", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_active", type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], GrowthMetric.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "session_duration", type: "integer", nullable: true }),
    __metadata("design:type", Number)
], GrowthMetric.prototype, "sessionDuration", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], GrowthMetric.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], GrowthMetric.prototype, "updatedAt", void 0);
exports.GrowthMetric = GrowthMetric = __decorate([
    (0, typeorm_1.Entity)("growth_metrics"),
    (0, typeorm_1.Index)(["userId", "metricDate"]),
    (0, typeorm_1.Index)(["cohortId", "metricDate"])
], GrowthMetric);
//# sourceMappingURL=growth-metric.entity.js.map