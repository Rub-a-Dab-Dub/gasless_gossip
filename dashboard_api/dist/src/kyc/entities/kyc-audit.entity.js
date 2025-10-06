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
exports.KycAudit = exports.AuditAction = void 0;
const typeorm_1 = require("typeorm");
const kyc_entity_1 = require("./kyc.entity");
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATED"] = "created";
    AuditAction["STATUS_CHANGED"] = "status_changed";
    AuditAction["DOCUMENT_UPLOADED"] = "document_uploaded";
    AuditAction["VERIFIED_ON_CHAIN"] = "verified_on_chain";
    AuditAction["FLAGGED"] = "flagged";
    AuditAction["BULK_UPDATED"] = "bulk_updated";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
let KycAudit = class KycAudit {
    id;
    kycId;
    action;
    oldStatus;
    newStatus;
    performedBy;
    metadata;
    notes;
    createdAt;
    kyc;
};
exports.KycAudit = KycAudit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], KycAudit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KycAudit.prototype, "kycId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AuditAction }),
    __metadata("design:type", String)
], KycAudit.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: kyc_entity_1.KycStatus, nullable: true }),
    __metadata("design:type", String)
], KycAudit.prototype, "oldStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: kyc_entity_1.KycStatus, nullable: true }),
    __metadata("design:type", String)
], KycAudit.prototype, "newStatus", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KycAudit.prototype, "performedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], KycAudit.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KycAudit.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], KycAudit.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => kyc_entity_1.Kyc, kyc => kyc.audits, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'kycId' }),
    __metadata("design:type", kyc_entity_1.Kyc)
], KycAudit.prototype, "kyc", void 0);
exports.KycAudit = KycAudit = __decorate([
    (0, typeorm_1.Entity)('kyc_audits')
], KycAudit);
//# sourceMappingURL=kyc-audit.entity.js.map