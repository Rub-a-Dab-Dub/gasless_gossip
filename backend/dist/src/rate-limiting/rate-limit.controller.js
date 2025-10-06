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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitController = void 0;
const common_1 = require("@nestjs/common");
const rate_limit_service_1 = require("./services/rate-limit.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const throttler_1 = require("@nestjs/throttler");
let RateLimitController = class RateLimitController {
    rateLimitService;
    constructor(rateLimitService) {
        this.rateLimitService = rateLimitService;
    }
    async getViolations(userId, ipAddress, endpoint, hours, limit) {
        if (userId) {
            return this.rateLimitService.getViolationsByUser(userId, limit || 50);
        }
        if (ipAddress) {
            return this.rateLimitService.getViolationsByIp(ipAddress, limit || 50);
        }
        if (endpoint) {
            return this.rateLimitService.getViolationsByEndpoint(endpoint, limit || 50);
        }
        return this.rateLimitService.getRecentViolations(hours || 24, limit || 100);
    }
    async getStats(hours) {
        return this.rateLimitService.getViolationStats(hours || 24);
    }
    async getPerformanceMetrics() {
        return this.rateLimitService.getPerformanceMetrics();
    }
    async resolveViolation(violationId) {
        await this.rateLimitService.resolveViolation(violationId);
        return { status: 'resolved', violationId };
    }
    async ignoreViolation(violationId) {
        await this.rateLimitService.ignoreViolation(violationId);
        return { status: 'ignored', violationId };
    }
    async cleanupOldViolations(days) {
        const deletedCount = await this.rateLimitService.cleanupOldViolations(days || 30);
        return { status: 'cleaned', deletedCount };
    }
    async getMyViolations(req, limit) {
        return this.rateLimitService.getViolationsByUser(req.user.id, limit || 20);
    }
};
exports.RateLimitController = RateLimitController;
__decorate([
    (0, common_1.Get)('violations'),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('ipAddress')),
    __param(2, (0, common_1.Query)('endpoint')),
    __param(3, (0, common_1.Query)('hours', new common_1.ParseIntPipe({ optional: true }))),
    __param(4, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], RateLimitController.prototype, "getViolations", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, throttler_1.Throttle)({ short: { limit: 5, ttl: 60000 } }),
    __param(0, (0, common_1.Query)('hours', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RateLimitController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('performance'),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RateLimitController.prototype, "getPerformanceMetrics", null);
__decorate([
    (0, common_1.Post)('violations/:id/resolve'),
    (0, throttler_1.Throttle)({ short: { limit: 20, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RateLimitController.prototype, "resolveViolation", null);
__decorate([
    (0, common_1.Post)('violations/:id/ignore'),
    (0, throttler_1.Throttle)({ short: { limit: 20, ttl: 60000 } }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RateLimitController.prototype, "ignoreViolation", null);
__decorate([
    (0, common_1.Post)('cleanup'),
    (0, throttler_1.Throttle)({ short: { limit: 2, ttl: 60000 } }),
    __param(0, (0, common_1.Query)('days', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RateLimitController.prototype, "cleanupOldViolations", null);
__decorate([
    (0, common_1.Get)('my-violations'),
    (0, throttler_1.Throttle)({ short: { limit: 5, ttl: 60000 } }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], RateLimitController.prototype, "getMyViolations", null);
exports.RateLimitController = RateLimitController = __decorate([
    (0, common_1.Controller)('rate-limit'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [rate_limit_service_1.RateLimitService])
], RateLimitController);
//# sourceMappingURL=rate-limit.controller.js.map