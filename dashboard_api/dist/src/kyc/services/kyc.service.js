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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const kyc_entity_1 = require("./entities/kyc.entity");
const kyc_audit_entity_1 = require("./entities/kyc-audit.entity");
const document_storage_service_1 = require("./services/document-storage.service");
const blockchain_verify_service_1 = require("./services/blockchain-verify.service");
let KycService = class KycService {
    kycRepo;
    auditRepo;
    dataSource;
    docStorage;
    blockchain;
    constructor(kycRepo, auditRepo, dataSource, docStorage, blockchain) {
        this.kycRepo = kycRepo;
        this.auditRepo = auditRepo;
        this.dataSource = dataSource;
        this.docStorage = docStorage;
        this.blockchain = blockchain;
    }
    async create(dto, adminId) {
        const existing = await this.kycRepo.findOne({ where: { userId: dto.userId } });
        if (existing) {
            throw new common_1.ConflictException('KYC record already exists for this user');
        }
        const kyc = this.kycRepo.create({
            ...dto,
            status: dto.status || kyc_entity_1.KycStatus.PENDING,
        });
        const saved = await this.kycRepo.save(kyc);
        await this.createAudit(saved.id, kyc_audit_entity_1.AuditAction.CREATED, null, saved.status, adminId, dto.notes);
        return saved;
    }
    async findAll(query) {
        const { page, limit, status, verificationLevel, userId, reviewedBy } = query;
        const skip = (page - 1) * limit;
        const qb = this.kycRepo.createQueryBuilder('kyc')
            .leftJoinAndSelect('kyc.audits', 'audits')
            .orderBy('kyc.createdAt', 'DESC');
        if (status)
            qb.andWhere('kyc.status = :status', { status });
        if (verificationLevel !== undefined) {
            qb.andWhere('kyc.verificationLevel = :verificationLevel', { verificationLevel });
        }
        if (userId)
            qb.andWhere('kyc.userId = :userId', { userId });
        if (reviewedBy)
            qb.andWhere('kyc.reviewedBy = :reviewedBy', { reviewedBy });
        const [records, total] = await qb.skip(skip).take(limit).getManyAndCount();
        return {
            data: records,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const kyc = await this.kycRepo.findOne({
            where: { id },
            relations: ['audits'],
        });
        if (!kyc)
            throw new common_1.NotFoundException('KYC record not found');
        return kyc;
    }
    async findByUserId(userId) {
        const kyc = await this.kycRepo.findOne({
            where: { userId },
            relations: ['audits'],
        });
        if (!kyc)
            throw new common_1.NotFoundException('KYC record not found for user');
        return kyc;
    }
    async updateStatus(id, dto, adminId) {
        const kyc = await this.kycRepo.findOne({ where: { id } });
        if (!kyc)
            throw new common_1.NotFoundException('KYC record not found');
        const oldStatus = kyc.status;
        kyc.status = dto.status;
        if (dto.verificationLevel !== undefined) {
            kyc.verificationLevel = dto.verificationLevel;
        }
        if (dto.rejectionReason) {
            kyc.rejectionReason = dto.rejectionReason;
        }
        kyc.reviewedBy = adminId;
        kyc.reviewedAt = new Date();
        const updated = await this.kycRepo.save(kyc);
        await this.createAudit(kyc.id, kyc_audit_entity_1.AuditAction.STATUS_CHANGED, oldStatus, dto.status, adminId, dto.notes);
        return updated;
    }
    async uploadDocument(id, file, docType, adminId) {
        const kyc = await this.kycRepo.findOne({ where: { id } });
        if (!kyc)
            throw new common_1.NotFoundException('KYC record not found');
        const { url, hash } = await this.docStorage.upload(file, kyc.userId);
        const docs = kyc.documents || [];
        docs.push({
            type: docType,
            url,
            hash,
            uploadedAt: new Date().toISOString(),
        });
        kyc.documents = docs;
        const updated = await this.kycRepo.save(kyc);
        await this.createAudit(kyc.id, kyc_audit_entity_1.AuditAction.DOCUMENT_UPLOADED, null, null, adminId, `Uploaded ${docType}`, { docType, hash });
        return updated;
    }
    async verifyOnChain(id, adminId) {
        const kyc = await this.kycRepo.findOne({ where: { id } });
        if (!kyc)
            throw new common_1.NotFoundException('KYC record not found');
        const { proof, txHash } = await this.blockchain.verify(kyc.userId, kyc.documents);
        kyc.blockchainProof = proof;
        kyc.onChainTxHash = txHash;
        kyc.isVerifiedOnChain = true;
        const updated = await this.kycRepo.save(kyc);
        await this.createAudit(kyc.id, kyc_audit_entity_1.AuditAction.VERIFIED_ON_CHAIN, null, null, adminId, 'On-chain verification completed', { txHash, proof });
        return updated;
    }
    async bulkApply(dto, adminId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existing = await queryRunner.manager.find(kyc_entity_1.Kyc, {
                where: { userId: (0, typeorm_2.In)(dto.userIds) },
            });
            const existingUserIds = new Set(existing.map(k => k.userId));
            const toCreate = dto.userIds.filter(id => !existingUserIds.has(id));
            const toUpdate = existing;
            for (const kyc of toUpdate) {
                const oldStatus = kyc.status;
                kyc.status = dto.status;
                if (dto.verificationLevel !== undefined) {
                    kyc.verificationLevel = dto.verificationLevel;
                }
                kyc.reviewedBy = adminId;
                kyc.reviewedAt = new Date();
                await queryRunner.manager.save(kyc);
                const audit = this.auditRepo.create({
                    kycId: kyc.id,
                    action: kyc_audit_entity_1.AuditAction.BULK_UPDATED,
                    oldStatus,
                    newStatus: dto.status,
                    performedBy: adminId,
                    notes: dto.notes,
                });
                await queryRunner.manager.save(audit);
            }
            const newRecords = toCreate.map(userId => this.kycRepo.create({
                userId,
                status: dto.status,
                verificationLevel: dto.verificationLevel,
            }));
            if (newRecords.length > 0) {
                const saved = await queryRunner.manager.save(newRecords);
                for (const kyc of saved) {
                    const audit = this.auditRepo.create({
                        kycId: kyc.id,
                        action: kyc_audit_entity_1.AuditAction.CREATED,
                        oldStatus: null,
                        newStatus: dto.status,
                        performedBy: adminId,
                        notes: dto.notes,
                    });
                    await queryRunner.manager.save(audit);
                }
            }
            await queryRunner.commitTransaction();
            return {
                updated: toUpdate.length,
                created: newRecords.length,
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createAudit(kycId, action, oldStatus, newStatus, adminId, notes, metadata) {
        const audit = this.auditRepo.create({
            kycId,
            action,
            oldStatus,
            newStatus,
            performedBy: adminId,
            notes,
            metadata,
        });
        await this.auditRepo.save(audit);
    }
};
exports.KycService = KycService;
exports.KycService = KycService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(kyc_entity_1.Kyc)),
    __param(1, (0, typeorm_1.InjectRepository)(kyc_audit_entity_1.KycAudit)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource, typeof (_a = typeof document_storage_service_1.DocumentStorageService !== "undefined" && document_storage_service_1.DocumentStorageService) === "function" ? _a : Object, typeof (_b = typeof blockchain_verify_service_1.BlockchainVerifyService !== "undefined" && blockchain_verify_service_1.BlockchainVerifyService) === "function" ? _b : Object])
], KycService);
//# sourceMappingURL=kyc.service.js.map