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
exports.ComparePeriodsQuery = exports.TopUsersQuery = exports.DateRangeQuery = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class DateRangeQuery {
    startDate;
    endDate;
}
exports.DateRangeQuery = DateRangeQuery;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DateRangeQuery.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DateRangeQuery.prototype, "endDate", void 0);
class TopUsersQuery extends DateRangeQuery {
    limit;
}
exports.TopUsersQuery = TopUsersQuery;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 10 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TopUsersQuery.prototype, "limit", void 0);
class ComparePeriodsQuery {
    period1Start;
    period1End;
    period2Start;
    period2End;
}
exports.ComparePeriodsQuery = ComparePeriodsQuery;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ComparePeriodsQuery.prototype, "period1Start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ComparePeriodsQuery.prototype, "period1End", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ComparePeriodsQuery.prototype, "period2Start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ComparePeriodsQuery.prototype, "period2End", void 0);
//# sourceMappingURL=query.dto.js.map