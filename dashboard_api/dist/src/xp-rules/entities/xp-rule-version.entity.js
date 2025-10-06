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
exports.XpRuleVersion = void 0;
const typeorm_1 = require("typeorm");
let XpRuleVersion = class XpRuleVersion {
    id;
    ruleId;
    version;
    ruleData;
    changeDescription;
    changedBy;
    createdAt;
};
exports.XpRuleVersion = XpRuleVersion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], XpRuleVersion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], XpRuleVersion.prototype, "ruleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], XpRuleVersion.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], XpRuleVersion.prototype, "ruleData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], XpRuleVersion.prototype, "changeDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], XpRuleVersion.prototype, "changedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], XpRuleVersion.prototype, "createdAt", void 0);
exports.XpRuleVersion = XpRuleVersion = __decorate([
    (0, typeorm_1.Entity)("xp_rule_versions"),
    (0, typeorm_1.Index)(["ruleId", "version"])
], XpRuleVersion);
//# sourceMappingURL=xp-rule-version.entity.js.map