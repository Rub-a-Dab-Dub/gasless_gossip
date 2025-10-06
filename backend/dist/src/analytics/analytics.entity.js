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
exports.Analytic = exports.MetricType = void 0;
const typeorm_1 = require("typeorm");
var MetricType;
(function (MetricType) {
    MetricType["VISIT"] = "visit";
    MetricType["TIP"] = "tip";
    MetricType["REACTION"] = "reaction";
    MetricType["MESSAGE"] = "message";
    MetricType["ROOM_JOIN"] = "room_join";
    MetricType["ROOM_LEAVE"] = "room_leave";
})(MetricType || (exports.MetricType = MetricType = {}));
let Analytic = class Analytic {
    id;
    metricType;
    userId;
    roomId;
    value;
    metadata;
    createdAt;
};
exports.Analytic = Analytic;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Analytic.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MetricType,
        nullable: false
    }),
    __metadata("design:type", String)
], Analytic.prototype, "metricType", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: false }),
    __metadata("design:type", String)
], Analytic.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], Analytic.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 1 }),
    __metadata("design:type", Number)
], Analytic.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], Analytic.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Analytic.prototype, "createdAt", void 0);
exports.Analytic = Analytic = __decorate([
    (0, typeorm_1.Entity)('analytics'),
    (0, typeorm_1.Index)(['userId', 'metricType']),
    (0, typeorm_1.Index)(['roomId', 'metricType']),
    (0, typeorm_1.Index)(['createdAt'])
], Analytic);
//# sourceMappingURL=analytics.entity.js.map