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
exports.TwoFactorAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const two_factor_auth_service_1 = require("../services/two-factor-auth.service");
let TwoFactorAuthGuard = class TwoFactorAuthGuard {
    twoFactorAuthService;
    constructor(twoFactorAuthService) {
        this.twoFactorAuthService = twoFactorAuthService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        const is2FAEnabled = await this.twoFactorAuthService.is2FAEnabled(user.id);
        if (is2FAEnabled && !request.headers['x-2fa-verified']) {
            throw new common_1.UnauthorizedException('2FA verification required');
        }
        return true;
    }
};
exports.TwoFactorAuthGuard = TwoFactorAuthGuard;
exports.TwoFactorAuthGuard = TwoFactorAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [two_factor_auth_service_1.TwoFactorAuthService])
], TwoFactorAuthGuard);
//# sourceMappingURL=two-factor-auth.guard.js.map