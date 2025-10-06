import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Kyc, KycStatus } from './entities/kyc.entity';
import { KycAudit, AuditAction } from './entities/kyc-audit.entity';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycStatusDto } from './dto/update-kyc-status.dto';
import { QueryKycDto } from './dto/query-kyc.dto';
import { BulkApplyKycDto } from './dto/bulk-apply-kyc.dto';
import { DocumentStorageService } from './services/document-storage.service';
import { BlockchainVerifyService } from './services/blockchain-verify.service';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(Kyc)
    private kycRepo: Repository<Kyc>,
    @InjectRepository(KycAudit)
    private auditRepo: Repository<KycAudit>,
    private dataSource: DataSource,
    private docStorage: DocumentStorageService,
    private blockchain: BlockchainVerifyService,
  ) {}

  async create(dto: CreateKycDto, adminId: string): Promise<Kyc> {
    const existing = await this.kycRepo.findOne({ where: { userId: dto.userId } });
    if (existing) {
      throw new ConflictException('KYC record already exists for this user');
    }

    const kyc = this.kycRepo.create({
      ...dto,
      status: dto.status || KycStatus.PENDING,
    });

    const saved = await this.kycRepo.save(kyc);

    await this.createAudit(saved.id, AuditAction.CREATED, null, saved.status, adminId, dto.notes);

    return saved;
  }

  async findAll(query: QueryKycDto) {
    const { page, limit, status, verificationLevel, userId, reviewedBy } = query;
    const skip = (page - 1) * limit;

    const qb = this.kycRepo.createQueryBuilder('kyc')
      .leftJoinAndSelect('kyc.audits', 'audits')
      .orderBy('kyc.createdAt', 'DESC');

    if (status) qb.andWhere('kyc.status = :status', { status });
    if (verificationLevel !== undefined) {
      qb.andWhere('kyc.verificationLevel = :verificationLevel', { verificationLevel });
    }
    if (userId) qb.andWhere('kyc.userId = :userId', { userId });
    if (reviewedBy) qb.andWhere('kyc.reviewedBy = :reviewedBy', { reviewedBy });

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

  async findOne(id: string): Promise<Kyc> {
    const kyc = await this.kycRepo.findOne({
      where: { id },
      relations: ['audits'],
    });

    if (!kyc) throw new NotFoundException('KYC record not found');
    return kyc;
  }

  async findByUserId(userId: string): Promise<Kyc> {
    const kyc = await this.kycRepo.findOne({
      where: { userId },
      relations: ['audits'],
    });

    if (!kyc) throw new NotFoundException('KYC record not found for user');
    return kyc;
  }

  async updateStatus(id: string, dto: UpdateKycStatusDto, adminId: string): Promise<Kyc> {
    const kyc = await this.kycRepo.findOne({ where: { id } });
    if (!kyc) throw new NotFoundException('KYC record not found');

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

    await this.createAudit(
      kyc.id,
      AuditAction.STATUS_CHANGED,
      oldStatus,
      dto.status,
      adminId,
      dto.notes,
    );

    return updated;
  }

  async uploadDocument(id: string, file: Express.Multer.File, docType: string, adminId: string): Promise<Kyc> {
    const kyc = await this.kycRepo.findOne({ where: { id } });
    if (!kyc) throw new NotFoundException('KYC record not found');

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

    await this.createAudit(
      kyc.id,
      AuditAction.DOCUMENT_UPLOADED,
      null,
      null,
      adminId,
      `Uploaded ${docType}`,
      { docType, hash },
    );

    return updated;
  }

  async verifyOnChain(id: string, adminId: string): Promise<Kyc> {
    const kyc = await this.kycRepo.findOne({ where: { id } });
    if (!kyc) throw new NotFoundException('KYC record not found');

    const { proof, txHash } = await this.blockchain.verify(kyc.userId, kyc.documents);

    kyc.blockchainProof = proof;
    kyc.onChainTxHash = txHash;
    kyc.isVerifiedOnChain = true;

    const updated = await this.kycRepo.save(kyc);

    await this.createAudit(
      kyc.id,
      AuditAction.VERIFIED_ON_CHAIN,
      null,
      null,
      adminId,
      'On-chain verification completed',
      { txHash, proof },
    );

    return updated;
  }

  async bulkApply(dto: BulkApplyKycDto, adminId: string): Promise<{ updated: number; created: number }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existing = await queryRunner.manager.find(Kyc, {
        where: { userId: In(dto.userIds) },
      });

      const existingUserIds = new Set(existing.map(k => k.userId));
      const toCreate = dto.userIds.filter(id => !existingUserIds.has(id));
      const toUpdate = existing;

      // Update existing
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
          action: AuditAction.BULK_UPDATED,
          oldStatus,
          newStatus: dto.status,
          performedBy: adminId,
          notes: dto.notes,
        });
        await queryRunner.manager.save(audit);
      }

      // Create new
      const newRecords = toCreate.map(userId =>
        this.kycRepo.create({
          userId,
          status: dto.status,
          verificationLevel: dto.verificationLevel,
        }),
      );

      if (newRecords.length > 0) {
        const saved = await queryRunner.manager.save(newRecords);

        for (const kyc of saved) {
          const audit = this.auditRepo.create({
            kycId: kyc.id,
            action: AuditAction.CREATED,
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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async createAudit(
    kycId: string,
    action: AuditAction,
    oldStatus: KycStatus | null,
    newStatus: KycStatus | null,
    adminId: string,
    notes?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
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
}