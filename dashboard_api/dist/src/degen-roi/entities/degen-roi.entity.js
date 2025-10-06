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
exports.DegenRoiEntity = void 0;
const typeorm_1 = require("typeorm");
let DegenRoiEntity = class DegenRoiEntity {
    id;
    roomCategory;
    winRate;
    totalWagered;
    totalReturned;
    roiPercentage;
    totalBets;
    winningBets;
    losingBets;
    isAnomaly;
    avgBetSize;
    outcomeDistribution;
    timestamp;
    updatedAt;
};
exports.DegenRoiEntity = DegenRoiEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DegenRoiEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], DegenRoiEntity.prototype, "roomCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], DegenRoiEntity.prototype, "winRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], DegenRoiEntity.prototype, "totalWagered", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], DegenRoiEntity.prototype, "totalReturned", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4 }),
    __metadata("design:type", Number)
], DegenRoiEntity.prototype, "roiPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], DegenRoiEntity.prototype, "totalBets", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], DegenRoiEntity.prototype, "winningBets", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], DegenRoiEntity.prototype, "losingBets", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], DegenRoiEntity.prototype, "isAnomaly", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], DegenRoiEntity.prototype, "avgBetSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], DegenRoiEntity.prototype, "outcomeDistribution", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DegenRoiEntity.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DegenRoiEntity.prototype, "updatedAt", void 0);
exports.DegenRoiEntity = DegenRoiEntity = __decorate([
    (0, typeorm_1.Entity)('degen_roi'),
    (0, typeorm_1.Index)(['roomCategory', 'timestamp'])
], DegenRoiEntity);
//# sourceMappingURL=degen-roi.entity.js.map