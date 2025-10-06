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
exports.DauAlert = void 0;
const typeorm_1 = require("typeorm");
let DauAlert = class DauAlert {
    id;
    alertDate;
    featureName;
    alertType;
    severity;
    currentValue;
    expectedValue;
    dropPercentage;
    message;
    isResolved;
    resolvedAt;
    createdAt;
};
exports.DauAlert = DauAlert;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], DauAlert.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "alert_date", type: "timestamp" }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], DauAlert.prototype, "alertDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "feature_name", type: "varchar" }),
    __metadata("design:type", String)
], DauAlert.prototype, "featureName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "alert_type", type: "varchar" }),
    __metadata("design:type", String)
], DauAlert.prototype, "alertType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "severity", type: "varchar" }),
    __metadata("design:type", String)
], DauAlert.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "current_value", type: "integer" }),
    __metadata("design:type", Number)
], DauAlert.prototype, "currentValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "expected_value", type: "integer" }),
    __metadata("design:type", Number)
], DauAlert.prototype, "expectedValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "drop_percentage", type: "decimal", precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], DauAlert.prototype, "dropPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "message", type: "text" }),
    __metadata("design:type", String)
], DauAlert.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_resolved", type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], DauAlert.prototype, "isResolved", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "resolved_at", type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], DauAlert.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], DauAlert.prototype, "createdAt", void 0);
exports.DauAlert = DauAlert = __decorate([
    (0, typeorm_1.Entity)("dau_alerts"),
    (0, typeorm_1.Index)(["alertDate", "isResolved"]),
    (0, typeorm_1.Index)(["featureName", "alertDate"])
], DauAlert);
//# sourceMappingURL=dau-alert.entity.js.map