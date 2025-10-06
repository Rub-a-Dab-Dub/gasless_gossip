"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitMiddleware = void 0;
const common_1 = require("@nestjs/common");
let RateLimitMiddleware = class RateLimitMiddleware {
    store = {};
    windowMs = 15 * 60 * 1000;
    maxRequests = 100;
    use(req, res, next) {
        const key = this.getKey(req);
        const now = Date.now();
        this.cleanup(now);
        if (!this.store[key]) {
            this.store[key] = {
                count: 0,
                resetTime: now + this.windowMs,
            };
        }
        const entry = this.store[key];
        if (now > entry.resetTime) {
            entry.count = 0;
            entry.resetTime = now + this.windowMs;
        }
        if (entry.count >= this.maxRequests) {
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
                message: "Too many requests",
                retryAfter: Math.ceil((entry.resetTime - now) / 1000),
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        entry.count++;
        res.setHeader("X-RateLimit-Limit", this.maxRequests);
        res.setHeader("X-RateLimit-Remaining", this.maxRequests - entry.count);
        res.setHeader("X-RateLimit-Reset", Math.ceil(entry.resetTime / 1000));
        next();
    }
    getKey(req) {
        const ip = req.ip || req.connection.remoteAddress || "unknown";
        const userId = req.user?.id || "anonymous";
        return `${ip}:${userId}`;
    }
    cleanup(now) {
        Object.keys(this.store).forEach((key) => {
            if (now > this.store[key].resetTime + this.windowMs) {
                delete this.store[key];
            }
        });
    }
};
exports.RateLimitMiddleware = RateLimitMiddleware;
exports.RateLimitMiddleware = RateLimitMiddleware = __decorate([
    (0, common_1.Injectable)()
], RateLimitMiddleware);
//# sourceMappingURL=rate-limit.middleware.js.map