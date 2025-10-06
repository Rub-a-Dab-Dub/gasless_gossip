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
exports.FeatureUsage = void 0;
const typeorm_1 = require("typeorm");
let FeatureUsage = class FeatureUsage {
    id;
    userId;
    featureName;
    usageDate;
    usageTimestamp;
    timezone;
    sessionId;
    durationSeconds;
    isNewUser;
    metadata;
    createdAt;
};
exports.FeatureUsage = FeatureUsage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], FeatureUsage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_id", type: "uuid" }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FeatureUsage.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "feature_name", type: "varchar" }),
    __metadata("design:type", String)
], FeatureUsage.prototype, "featureName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "usage_date", type: "date" }),
    __metadata("design:type", Date)
], FeatureUsage.prototype, "usageDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "usage_timestamp", type: "timestamp" }),
    __metadata("design:type", Date)
], FeatureUsage.prototype, "usageTimestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "timezone", type: "varchar", default: "UTC" }),
    __metadata("design:type", String)
], FeatureUsage.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "session_id", type: "varchar", nullable: true }),
    __metadata("design:type", String)
], FeatureUsage.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "duration_seconds", type: "integer", nullable: true }),
    __metadata("design:type", Number)
], FeatureUsage.prototype, "durationSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_new_user", type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], FeatureUsage.prototype, "isNewUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "metadata", type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], FeatureUsage.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], FeatureUsage.prototype, "createdAt", void 0);
exports.FeatureUsage = FeatureUsage = __decorate([
    (0, typeorm_1.Entity)("feature_usage"),
    (0, typeorm_1.Index)(["userId", "featureName", "usageDate"]),
    (0, typeorm_1.Index)(["featureName", "usageDate"])
], FeatureUsage);
//# sourceMappingURL=feature-usage.entity.js.map