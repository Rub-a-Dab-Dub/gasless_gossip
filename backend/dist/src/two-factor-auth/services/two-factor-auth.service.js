"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorAuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const two_factor_entity_1 = require("../entities/two-factor.entity");
const speakeasy = __importStar(require("speakeasy"));
const QRCode = __importStar(require("qrcode"));
let TwoFactorAuthService = class TwoFactorAuthService {
    twoFactorRepository;
    constructor(twoFactorRepository) {
        this.twoFactorRepository = twoFactorRepository;
    }
    async enable2FA(enable2FADto) {
        const { userId, method } = enable2FADto;
        const existing2FA = await this.twoFactorRepository.findOne({
            where: { userId },
        });
        if (existing2FA && existing2FA.isEnabled) {
            throw new common_1.BadRequestException('2FA is already enabled for this user');
        }
        let secret;
        let qrCode;
        if (method === two_factor_entity_1.TwoFactorMethod.TOTP) {
            const secretObj = speakeasy.generateSecret({
                name: `Whisper (${userId})`,
                issuer: 'Whisper',
            });
            secret = secretObj.base32;
            qrCode = await QRCode.toDataURL(secretObj.otpauth_url);
        }
        else {
            secret = speakeasy.generateSecret({ length: 20 }).base32;
        }
        if (existing2FA) {
            existing2FA.method = method;
            existing2FA.secret = secret;
            existing2FA.isEnabled = false;
            await this.twoFactorRepository.save(existing2FA);
        }
        else {
            const newTwoFactor = this.twoFactorRepository.create({
                userId,
                method,
                secret,
                isEnabled: false,
            });
            await this.twoFactorRepository.save(newTwoFactor);
        }
        return { secret, qrCode };
    }
    async verify2FA(verify2FADto) {
        const { userId, code } = verify2FADto;
        const twoFactor = await this.twoFactorRepository.findOne({
            where: { userId },
        });
        if (!twoFactor) {
            throw new common_1.NotFoundException('2FA not configured for this user');
        }
        let isValid = false;
        if (twoFactor.method === two_factor_entity_1.TwoFactorMethod.TOTP) {
            isValid = speakeasy.totp.verify({
                secret: twoFactor.secret,
                encoding: 'base32',
                token: code,
                window: 2,
            });
        }
        else if (twoFactor.method === two_factor_entity_1.TwoFactorMethod.EMAIL) {
            isValid = speakeasy.totp.verify({
                secret: twoFactor.secret,
                encoding: 'base32',
                token: code,
                window: 6,
            });
        }
        if (isValid) {
            twoFactor.isEnabled = true;
            twoFactor.lastUsedAt = new Date();
            await this.twoFactorRepository.save(twoFactor);
        }
        return { verified: isValid };
    }
    async is2FAEnabled(userId) {
        const twoFactor = await this.twoFactorRepository.findOne({
            where: { userId, isEnabled: true },
        });
        return !!twoFactor;
    }
    async get2FAMethod(userId) {
        const twoFactor = await this.twoFactorRepository.findOne({
            where: { userId, isEnabled: true },
        });
        return twoFactor?.method || null;
    }
    async disable2FA(userId) {
        await this.twoFactorRepository.update({ userId }, { isEnabled: false, secret: null });
    }
    generateEmailCode(secret) {
        return speakeasy.totp({
            secret,
            encoding: 'base32',
            step: 300,
        });
    }
};
exports.TwoFactorAuthService = TwoFactorAuthService;
exports.TwoFactorAuthService = TwoFactorAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(two_factor_entity_1.TwoFactor)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TwoFactorAuthService);
//# sourceMappingURL=two-factor-auth.service.js.map