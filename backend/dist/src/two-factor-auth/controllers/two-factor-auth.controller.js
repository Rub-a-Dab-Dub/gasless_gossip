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
exports.TwoFactorAuthController = void 0;
const common_1 = require("@nestjs/common");
const two_factor_auth_service_1 = require("../services/two-factor-auth.service");
const enable_2fa_dto_1 = require("../dto/enable-2fa.dto");
const verify_2fa_dto_1 = require("../dto/verify-2fa.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let TwoFactorAuthController = class TwoFactorAuthController {
    twoFactorAuthService;
    constructor(twoFactorAuthService) {
        this.twoFactorAuthService = twoFactorAuthService;
    }
    async enable2FA(enable2FADto, req) {
        const userId = req.user.id;
        const result = await this.twoFactorAuthService.enable2FA({
            ...enable2FADto,
            userId,
        });
        return {
            message: '2FA setup initiated. Please verify with the provided code.',
            secret: result.secret,
            qrCode: result.qrCode,
            method: enable2FADto.method,
        };
    }
    async verify2FA(verify2FADto, req) {
        const userId = req.user.id;
        const result = await this.twoFactorAuthService.verify2FA({
            ...verify2FADto,
            userId,
        });
        if (result.verified) {
            return {
                message: '2FA successfully enabled and verified.',
                verified: true,
            };
        }
        else {
            return {
                message: 'Invalid verification code.',
                verified: false,
            };
        }
    }
    async disable2FA(req) {
        const userId = req.user.id;
        await this.twoFactorAuthService.disable2FA(userId);
        return {
            message: '2FA has been disabled.',
        };
    }
};
exports.TwoFactorAuthController = TwoFactorAuthController;
__decorate([
    (0, common_1.Post)('enable'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [enable_2fa_dto_1.Enable2FADto, Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthController.prototype, "enable2FA", null);
__decorate([
    (0, common_1.Post)('verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_2fa_dto_1.Verify2FADto, Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthController.prototype, "verify2FA", null);
__decorate([
    (0, common_1.Post)('disable'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthController.prototype, "disable2FA", null);
exports.TwoFactorAuthController = TwoFactorAuthController = __decorate([
    (0, common_1.Controller)('2fa'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [two_factor_auth_service_1.TwoFactorAuthService])
], TwoFactorAuthController);
//# sourceMappingURL=two-factor-auth.controller.js.map