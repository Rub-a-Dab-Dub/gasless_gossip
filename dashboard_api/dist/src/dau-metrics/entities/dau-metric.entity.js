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
exports.DauMetric = void 0;
const typeorm_1 = require("typeorm");
let DauMetric = class DauMetric {
    id;
    metricDate;
    timezone;
    featureName;
    uniqueUsers;
    totalSessions;
    totalDurationSeconds;
    newUsers;
    returningUsers;
    benchmarkGoal;
    metadata;
    createdAt;
    updatedAt;
};
exports.DauMetric = DauMetric;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], DauMetric.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "metric_date", type: "date" }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], DauMetric.prototype, "metricDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "timezone", type: "varchar", default: "UTC" }),
    __metadata("design:type", String)
], DauMetric.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "feature_name", type: "varchar" }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], DauMetric.prototype, "featureName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "unique_users", type: "integer", default: 0 }),
    __metadata("design:type", Number)
], DauMetric.prototype, "uniqueUsers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "total_sessions", type: "integer", default: 0 }),
    __metadata("design:type", Number)
], DauMetric.prototype, "totalSessions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "total_duration_seconds", type: "bigint", default: 0 }),
    __metadata("design:type", Number)
], DauMetric.prototype, "totalDurationSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "new_users", type: "integer", default: 0 }),
    __metadata("design:type", Number)
], DauMetric.prototype, "newUsers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "returning_users", type: "integer", default: 0 }),
    __metadata("design:type", Number)
], DauMetric.prototype, "returningUsers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "benchmark_goal", type: "integer", nullable: true }),
    __metadata("design:type", Number)
], DauMetric.prototype, "benchmarkGoal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "metadata", type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], DauMetric.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], DauMetric.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], DauMetric.prototype, "updatedAt", void 0);
exports.DauMetric = DauMetric = __decorate([
    (0, typeorm_1.Entity)("dau_metrics"),
    (0, typeorm_1.Index)(["metricDate", "timezone"]),
    (0, typeorm_1.Index)(["featureName", "metricDate"])
], DauMetric);
//# sourceMappingURL=dau-metric.entity.js.map