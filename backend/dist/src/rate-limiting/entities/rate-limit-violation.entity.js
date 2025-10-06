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
exports.RateLimitViolation = void 0;
const typeorm_1 = require("typeorm");
let RateLimitViolation = class RateLimitViolation {
    id;
    userId;
    ipAddress;
    endpoint;
    violationType;
    requestCount;
    limit;
    userAgent;
    metadata;
    status;
    createdAt;
};
exports.RateLimitViolation = RateLimitViolation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RateLimitViolation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], RateLimitViolation.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 45 }),
    __metadata("design:type", String)
], RateLimitViolation.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], RateLimitViolation.prototype, "endpoint", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['short', 'medium', 'long', 'custom'],
        default: 'short'
    }),
    __metadata("design:type", String)
], RateLimitViolation.prototype, "violationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], RateLimitViolation.prototype, "requestCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], RateLimitViolation.prototype, "limit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], RateLimitViolation.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], RateLimitViolation.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'active' }),
    __metadata("design:type", String)
], RateLimitViolation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RateLimitViolation.prototype, "createdAt", void 0);
exports.RateLimitViolation = RateLimitViolation = __decorate([
    (0, typeorm_1.Entity)('rate_limit_violations'),
    (0, typeorm_1.Index)(['userId', 'createdAt']),
    (0, typeorm_1.Index)(['endpoint', 'createdAt']),
    (0, typeorm_1.Index)(['ipAddress', 'createdAt']),
    (0, typeorm_1.Index)(['violationType', 'createdAt'])
], RateLimitViolation);
//# sourceMappingURL=rate-limit-violation.entity.js.map