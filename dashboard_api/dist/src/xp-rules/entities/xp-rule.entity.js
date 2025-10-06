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
exports.XpRule = void 0;
const typeorm_1 = require("typeorm");
let XpRule = class XpRule {
    id;
    ruleName;
    ruleType;
    description;
    multiplier;
    baseAmount;
    conditions;
    isActive;
    priority;
    scope;
    abTestGroup;
    startDate;
    endDate;
    createdBy;
    updatedBy;
    createdAt;
    updatedAt;
};
exports.XpRule = XpRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], XpRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], XpRule.prototype, "ruleName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], XpRule.prototype, "ruleType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], XpRule.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, default: 1.0 }),
    __metadata("design:type", Number)
], XpRule.prototype, "multiplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], XpRule.prototype, "baseAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], XpRule.prototype, "conditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], XpRule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], XpRule.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, default: "global" }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], XpRule.prototype, "scope", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], XpRule.prototype, "abTestGroup", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], XpRule.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], XpRule.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], XpRule.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], XpRule.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], XpRule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], XpRule.prototype, "updatedAt", void 0);
exports.XpRule = XpRule = __decorate([
    (0, typeorm_1.Entity)("xp_rules"),
    (0, typeorm_1.Index)(["ruleType", "isActive"])
], XpRule);
//# sourceMappingURL=xp-rule.entity.js.map