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
exports.DailyAggregate = void 0;
const typeorm_1 = require("typeorm");
let DailyAggregate = class DailyAggregate {
    id;
    date;
    dailyVolume;
    cumulativeVolume;
    topUsers;
    trends;
    hasSpike;
    spikeData;
    transactionCount;
    uniqueUsers;
    blockNumber;
    createdAt;
    updatedAt;
};
exports.DailyAggregate = DailyAggregate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DailyAggregate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], DailyAggregate.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 24, scale: 8 }),
    __metadata("design:type", Number)
], DailyAggregate.prototype, "dailyVolume", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 24, scale: 8 }),
    __metadata("design:type", Number)
], DailyAggregate.prototype, "cumulativeVolume", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Array)
], DailyAggregate.prototype, "topUsers", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], DailyAggregate.prototype, "trends", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { default: false }),
    __metadata("design:type", Boolean)
], DailyAggregate.prototype, "hasSpike", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], DailyAggregate.prototype, "spikeData", void 0);
__decorate([
    (0, typeorm_1.Column)('integer'),
    __metadata("design:type", Number)
], DailyAggregate.prototype, "transactionCount", void 0);
__decorate([
    (0, typeorm_1.Column)('integer'),
    __metadata("design:type", Number)
], DailyAggregate.prototype, "uniqueUsers", void 0);
__decorate([
    (0, typeorm_1.Column)('integer'),
    __metadata("design:type", Number)
], DailyAggregate.prototype, "blockNumber", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DailyAggregate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DailyAggregate.prototype, "updatedAt", void 0);
exports.DailyAggregate = DailyAggregate = __decorate([
    (0, typeorm_1.Entity)('finance_metrics_daily_aggregates')
], DailyAggregate);
//# sourceMappingURL=daily-aggregate.entity.js.map