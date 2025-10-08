import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import { BanRecord } from './entities/ban-record.entity';
import { PatternDetectionService } from './pattern-detection.service';
import { EvasionEvidence } from './entities/evasion-evidence.entity';
import { Appeal } from './entities/appeal.entity';
import { IpLog } from './entities/ip-log.entity';
import { IpAnonymizationService } from './ip-anonymization.service';
import { WalletBlacklistService } from './wallet-blacklist.service';
import { CreateBanRecordDto } from './dto/create-ban-record.dto';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { ScanResultDto } from './dto/scan-result.dto';

@Injectable()
export class BanEvasionService {
  private readonly logger = new Logger(BanEvasionService.name);

  constructor(
    @InjectRepository(BanRecord)
    private readonly banRecordRepo: Repository<BanRecord>,
    @InjectRepository(EvasionEvidence)
    private readonly evidenceRepo: Repository<EvasionEvidence>,
    @InjectRepository(Appeal)
    private readonly appealRepo: Repository<Appeal>,
    @InjectRepository(IpLog)
    private readonly ipLogRepo: Repository<IpLog>,
    private readonly ipAnonymizer: IpAnonymizationService,
    private readonly walletBlacklist: WalletBlacklistService,
    private readonly patternDetection: PatternDetectionService
  ) {}

  async scanForEvasion(): Promise<ScanResultDto> {
    this.logger.log('Starting evasion detection scan...');
    
    const startTime = Date.now();
    const detectedEvasions = await this.patternDetection.detectPatterns(24); // Last 24 hours
    
    // Auto-ban high confidence matches
    for (const match of detectedEvasions) {
      if (match.confidence >= 0.9) {
        await this.createBanRecord({
          walletAddress: match.walletAddress,
          ipAddress: match.ipHash, // Already hashed
          reason: 'Automated detection - High confidence ban evasion',
          metadata: {
            autoDetected: true,
            confidence: match.confidence,
            evidence: match.evidence
          }
        });
      }
    }
    
    return {
      detectedEvasions,
      totalScanned: await this.ipLogRepo.count(),
      suspiciousActivities: detectedEvasions.length,
      timestamp: new Date(),
      executionTimeMs: Date.now() - startTime
    };
  }

  async createBanRecord(dto: CreateBanRecordDto): Promise<BanRecord> {
    const ipHash = await this.ipAnonymizer.hashIp(dto.ipAddress);
    const banRecord = this.banRecordRepo.create({
      ...dto,
      ipHash,
      evidenceCount: 0,
      status: 'ACTIVE'
    });
    return this.banRecordRepo.save(banRecord);
  }

  async logEvidence(banId: string, evidence: any): Promise<EvasionEvidence> {
    const banRecord = await this.banRecordRepo.findOneOrFail({ where: { id: banId }});
    const evidenceRecord = this.evidenceRepo.create({
      banRecord,
      ...evidence,
      timestamp: new Date()
    });
    
    await this.evidenceRepo.save(evidenceRecord);
    
    // Update evidence count
    await this.banRecordRepo.update(
      { id: banId },
      { evidenceCount: () => 'evidence_count + 1' }
    );

    return evidenceRecord;
  }

  async submitAppeal(dto: CreateAppealDto): Promise<Appeal> {
    const appeal = this.appealRepo.create({
      ...dto,
      status: 'PENDING',
      submittedAt: new Date()
    });
    return this.appealRepo.save(appeal);
  }

  async getAppealQueue(skip = 0, take = 20): Promise<Appeal[]> {
    return this.appealRepo.find({
      where: { status: 'PENDING' },
      skip,
      take,
      order: { submittedAt: 'ASC' }
    });
  }

  async processAppeal(appealId: string, approved: boolean): Promise<Appeal> {
    const appeal = await this.appealRepo.findOneOrFail({
      where: { id: appealId },
      relations: ['banRecord']
    });

    if (approved) {
      await this.banRecordRepo.update(
        { id: appeal.banRecord.id },
        { status: 'LIFTED' }
      );
    }

    appeal.status = approved ? 'APPROVED' : 'REJECTED';
    appeal.processedAt = new Date();
    
    return this.appealRepo.save(appeal);
  }
}