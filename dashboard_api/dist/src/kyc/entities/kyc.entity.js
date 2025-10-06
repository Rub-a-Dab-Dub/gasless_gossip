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
exports.Kyc = exports.VerificationLevel = exports.KycStatus = void 0;
const typeorm_1 = require("typeorm");
const kyc_audit_entity_1 = require("./kyc-audit.entity");
var KycStatus;
(function (KycStatus) {
    KycStatus["PENDING"] = "pending";
    KycStatus["APPROVED"] = "approved";
    KycStatus["REJECTED"] = "rejected";
    KycStatus["FLAGGED"] = "flagged";
})(KycStatus || (exports.KycStatus = KycStatus = {}));
var VerificationLevel;
(function (VerificationLevel) {
    VerificationLevel[VerificationLevel["NONE"] = 0] = "NONE";
    VerificationLevel[VerificationLevel["BASIC"] = 1] = "BASIC";
    VerificationLevel[VerificationLevel["ADVANCED"] = 2] = "ADVANCED";
    VerificationLevel[VerificationLevel["PREMIUM"] = 3] = "PREMIUM";
})(VerificationLevel || (exports.VerificationLevel = VerificationLevel = {}));
let Kyc = class Kyc {
    id;
    userId;
    status;
    verificationLevel;
    documents;
    blockchainProof;
    onChainTxHash;
    isVerifiedOnChain;
    rejectionReason;
    reviewedBy;
    reviewedAt;
    createdAt;
    updatedAt;
    audits;
};
exports.Kyc = Kyc;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Kyc.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Kyc.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: KycStatus, default: KycStatus.PENDING }),
    __metadata("design:type", String)
], Kyc.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: VerificationLevel, default: VerificationLevel.NONE }),
    __metadata("design:type", Number)
], Kyc.prototype, "verificationLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Kyc.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Kyc.prototype, "blockchainProof", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Kyc.prototype, "onChainTxHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Kyc.prototype, "isVerifiedOnChain", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Kyc.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Kyc.prototype, "reviewedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Kyc.prototype, "reviewedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Kyc.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Kyc.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kyc_audit_entity_1.KycAudit, audit => audit.kyc, { cascade: true }),
    __metadata("design:type", Array)
], Kyc.prototype, "audits", void 0);
exports.Kyc = Kyc = __decorate([
    (0, typeorm_1.Entity)('kyc_records')
], Kyc);
//# sourceMappingURL=kyc.entity.js.map