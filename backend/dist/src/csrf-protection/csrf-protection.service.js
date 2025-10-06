"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsrfProtectionService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let CsrfProtectionService = class CsrfProtectionService {
    secret = process.env.CSRF_SECRET || 'default-csrf-secret';
    tokenExpiry = 3600000;
    generateToken() {
        const timestamp = Date.now().toString();
        const randomValue = (0, crypto_1.randomBytes)(32).toString('hex');
        const payload = `${timestamp}:${randomValue}`;
        const signature = (0, crypto_1.createHmac)('sha256', this.secret)
            .update(payload)
            .digest('hex');
        const token = `${payload}:${signature}`;
        const expiresAt = new Date(Date.now() + this.tokenExpiry);
        return { token, expiresAt };
    }
    validateToken(token) {
        if (!token) {
            return { isValid: false, message: 'CSRF token is required' };
        }
        try {
            const parts = token.split(':');
            if (parts.length !== 3) {
                return { isValid: false, message: 'Invalid CSRF token format' };
            }
            const [timestamp, randomValue, signature] = parts;
            const payload = `${timestamp}:${randomValue}`;
            const expectedSignature = (0, crypto_1.createHmac)('sha256', this.secret)
                .update(payload)
                .digest('hex');
            if (signature !== expectedSignature) {
                return { isValid: false, message: 'Invalid CSRF token signature' };
            }
            const tokenTime = parseInt(timestamp, 10);
            if (Date.now() - tokenTime > this.tokenExpiry) {
                return { isValid: false, message: 'CSRF token has expired' };
            }
            return { isValid: true };
        }
        catch (error) {
            return { isValid: false, message: 'CSRF token validation failed' };
        }
    }
};
exports.CsrfProtectionService = CsrfProtectionService;
exports.CsrfProtectionService = CsrfProtectionService = __decorate([
    (0, common_1.Injectable)()
], CsrfProtectionService);
//# sourceMappingURL=csrf-protection.service.js.map