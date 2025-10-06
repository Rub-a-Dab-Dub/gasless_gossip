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
exports.Cohort = void 0;
const typeorm_1 = require("typeorm");
let Cohort = class Cohort {
    id;
    cohortName;
    startDate;
    endDate;
    description;
    userCount;
    createdAt;
    updatedAt;
};
exports.Cohort = Cohort;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Cohort.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "cohort_name", type: "varchar", unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Cohort.prototype, "cohortName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "start_date", type: "date" }),
    __metadata("design:type", Date)
], Cohort.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "end_date", type: "date", nullable: true }),
    __metadata("design:type", Date)
], Cohort.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "description", type: "text", nullable: true }),
    __metadata("design:type", String)
], Cohort.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_count", type: "integer", default: 0 }),
    __metadata("design:type", Number)
], Cohort.prototype, "userCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Cohort.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Cohort.prototype, "updatedAt", void 0);
exports.Cohort = Cohort = __decorate([
    (0, typeorm_1.Entity)("cohorts")
], Cohort);
//# sourceMappingURL=cohort.entity.js.map