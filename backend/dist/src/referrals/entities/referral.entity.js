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
exports.Referral = exports.ReferralStatus = void 0;
const typeorm_1 = require("typeorm");
var ReferralStatus;
(function (ReferralStatus) {
    ReferralStatus["PENDING"] = "pending";
    ReferralStatus["COMPLETED"] = "completed";
    ReferralStatus["FAILED"] = "failed";
})(ReferralStatus || (exports.ReferralStatus = ReferralStatus = {}));
let Referral = class Referral {
    id;
    referrerId;
    refereeId;
    reward;
    referralCode;
    status;
    stellarTransactionId;
    createdAt;
    completedAt;
};
exports.Referral = Referral;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Referral.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Referral.prototype, "referrerId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Referral.prototype, "refereeId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 7, default: 0 }),
    __metadata("design:type", Number)
], Referral.prototype, "reward", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, unique: true }),
    __metadata("design:type", String)
], Referral.prototype, "referralCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReferralStatus,
        default: ReferralStatus.PENDING
    }),
    __metadata("design:type", String)
], Referral.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Referral.prototype, "stellarTransactionId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Referral.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Referral.prototype, "completedAt", void 0);
exports.Referral = Referral = __decorate([
    (0, typeorm_1.Entity)('referrals'),
    (0, typeorm_1.Index)(['referrerId']),
    (0, typeorm_1.Index)(['refereeId']),
    (0, typeorm_1.Index)(['referralCode']),
    (0, typeorm_1.Index)(['status'])
], Referral);
//# sourceMappingURL=referral.entity.js.map