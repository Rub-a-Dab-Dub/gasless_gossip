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
var CustomThrottlerGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomThrottlerGuard = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const rate_limit_service_1 = require("../services/rate-limit.service");
let CustomThrottlerGuard = CustomThrottlerGuard_1 = class CustomThrottlerGuard extends throttler_1.ThrottlerGuard {
    rateLimitService;
    logger = new common_1.Logger(CustomThrottlerGuard_1.name);
    constructor(rateLimitService) {
        super();
        this.rateLimitService = rateLimitService;
    }
    async handleRequest(context, limit, ttl, throttler) {
        const { req, res } = this.getRequestResponse(context);
        const key = this.generateKey(context, req);
        const ttlMilliseconds = ttl * 1000;
        try {
            const { totalHits, timeToExpire } = await this.storageService.increment(key, ttlMilliseconds);
            if (totalHits > limit) {
                await this.logViolation(req, context, totalHits, limit, throttler);
                throw new throttler_1.ThrottlerException();
            }
            res.setHeader('X-RateLimit-Limit', limit);
            res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - totalHits));
            res.setHeader('X-RateLimit-Reset', new Date(Date.now() + timeToExpire).toISOString());
            return true;
        }
        catch (error) {
            if (error instanceof throttler_1.ThrottlerException) {
                throw error;
            }
            this.logger.error('Rate limiting error:', error);
            return true;
        }
    }
    async logViolation(req, context, requestCount, limit, throttler) {
        try {
            const userId = req.user?.id;
            const ipAddress = this.getClientIp(req);
            const endpoint = this.getEndpoint(context);
            const userAgent = req.get('User-Agent');
            await this.rateLimitService.logViolation({
                userId,
                ipAddress,
                endpoint,
                violationType: throttler,
                requestCount,
                limit,
                userAgent,
                metadata: {
                    method: req.method,
                    url: req.url,
                    headers: this.sanitizeHeaders(req.headers),
                },
            });
        }
        catch (error) {
            this.logger.error('Failed to log rate limit violation:', error);
        }
    }
    getClientIp(req) {
        return (req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection?.socket?.remoteAddress ||
            'unknown');
    }
    getEndpoint(context) {
        const handler = context.getHandler();
        const className = context.getClass().name;
        const methodName = handler.name;
        return `${className}.${methodName}`;
    }
    sanitizeHeaders(headers) {
        const sanitized = {};
        const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
        for (const [key, value] of Object.entries(headers)) {
            if (!sensitiveHeaders.includes(key.toLowerCase())) {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
};
exports.CustomThrottlerGuard = CustomThrottlerGuard;
exports.CustomThrottlerGuard = CustomThrottlerGuard = CustomThrottlerGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rate_limit_service_1.RateLimitService])
], CustomThrottlerGuard);
//# sourceMappingURL=custom-throttler.guard.js.map