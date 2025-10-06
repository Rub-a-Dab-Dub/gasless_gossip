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
exports.TwoFactor = exports.TwoFactorMethod = void 0;
const typeorm_1 = require("typeorm");
var TwoFactorMethod;
(function (TwoFactorMethod) {
    TwoFactorMethod["EMAIL"] = "email";
    TwoFactorMethod["TOTP"] = "totp";
})(TwoFactorMethod || (exports.TwoFactorMethod = TwoFactorMethod = {}));
let TwoFactor = class TwoFactor {
    id;
    userId;
    method;
    secret;
    isEnabled;
    lastUsedAt;
    createdAt;
    updatedAt;
};
exports.TwoFactor = TwoFactor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TwoFactor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], TwoFactor.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TwoFactorMethod,
        default: TwoFactorMethod.TOTP,
    }),
    __metadata("design:type", String)
], TwoFactor.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TwoFactor.prototype, "secret", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], TwoFactor.prototype, "isEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], TwoFactor.prototype, "lastUsedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TwoFactor.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TwoFactor.prototype, "updatedAt", void 0);
exports.TwoFactor = TwoFactor = __decorate([
    (0, typeorm_1.Entity)('two_factors'),
    (0, typeorm_1.Index)(['userId'], { unique: true })
], TwoFactor);
//# sourceMappingURL=two-factor.entity.js.map