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
exports.CsrfValidationMiddleware = void 0;
const common_1 = require("@nestjs/common");
const csrf_protection_service_1 = require("../csrf-protection.service");
let CsrfValidationMiddleware = class CsrfValidationMiddleware {
    csrfProtectionService;
    constructor(csrfProtectionService) {
        this.csrfProtectionService = csrfProtectionService;
    }
    use(req, res, next) {
        if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
            return next();
        }
        const csrfToken = req.headers['x-csrf-token'] ||
            req.body._csrf ||
            req.body.csrfToken;
        const validationResult = this.csrfProtectionService.validateToken(csrfToken);
        if (!validationResult.isValid) {
            throw new common_1.ForbiddenException(validationResult.message || 'CSRF validation failed');
        }
        next();
    }
};
exports.CsrfValidationMiddleware = CsrfValidationMiddleware;
exports.CsrfValidationMiddleware = CsrfValidationMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [csrf_protection_service_1.CsrfProtectionService])
], CsrfValidationMiddleware);
//# sourceMappingURL=csrf-validation.middleware.js.map