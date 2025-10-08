import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BanEvasionService } from '../ban-evasion.service';
import { IpAnonymizationService } from '../ip-anonymization.service';
import { WalletBlacklistService } from '../wallet-blacklist.service';
import { PatternDetectionService } from '../pattern-detection.service';
import { BanRecord } from '../entities/ban-record.entity';
import { EvasionEvidence } from '../entities/evasion-evidence.entity';
import { Appeal } from '../entities/appeal.entity';
import { IpLog } from '../entities/ip-log.entity';
import { WalletBlacklist } from '../entities/wallet-blacklist.entity';

describe('BanEvasion Integration', () => {
  let module: TestingModule;
  let banService: BanEvasionService;
  let ipService: IpAnonymizationService;
  let patternService: PatternDetectionService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.TEST_DB_HOST || 'localhost',
          port: parseInt(process.env.TEST_DB_PORT || '5432'),
          username: process.env.TEST_DB_USER || 'test',
          password: process.env.TEST_DB_PASS || 'test',
          database: process.env.TEST_DB_NAME || 'test_db',
          entities: [BanRecord, EvasionEvidence, Appeal, IpLog, WalletBlacklist],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([
          BanRecord,
          EvasionEvidence,
          Appeal,
          IpLog,
          WalletBlacklist,
        ]),
      ],
      providers: [
        BanEvasionService,
        IpAnonymizationService,
        WalletBlacklistService,
        PatternDetectionService,
      ],
    }).compile();

    banService = module.get<BanEvasionService>(BanEvasionService);
    ipService = module.get<IpAnonymizationService>(IpAnonymizationService);
    patternService = module.get<PatternDetectionService>(PatternDetectionService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('IP Anonymization', () => {
    it('should consistently hash the same IP', async () => {
      const ip = '192.168.1.1';
      const hash1 = await ipService.hashIp(ip);
      const hash2 = await ipService.hashIp(ip);
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different IPs', async () => {
      const ip1 = '192.168.1.1';
      const ip2 = '192.168.1.2';
      const hash1 = await ipService.hashIp(ip1);
      const hash2 = await ipService.hashIp(ip2);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Pattern Detection', () => {
    it('should detect multiple wallets from same IP', async () => {
      // Create test data
      const wallet1 = '0x1234...';
      const wallet2 = '0x5678...';
      const ipHash = await ipService.hashIp('192.168.1.1');

      // Create ban record for wallet1
      await banService.createBanRecord({
        walletAddress: wallet1,
        ipAddress: '192.168.1.1',
        reason: 'Test ban',
      });

      // Create IP logs for both wallets
      const timestamp = new Date();
      await Promise.all([
        banService.logIpActivity(wallet1, ipHash, 'LOGIN', timestamp),
        banService.logIpActivity(wallet2, ipHash, 'LOGIN', timestamp),
      ]);

      // Run detection
      const results = await patternService.detectPatterns(24);

      // Verify detection
      expect(results.length).toBeGreaterThan(0);
      const detection = results[0];
      expect(detection.confidence).toBeGreaterThan(0.7);
      expect(detection.evidence[0].type).toBe('IP_MATCH');
    });
  });

  describe('Appeal Process', () => {
    it('should process appeals and update ban status', async () => {
      // Create a ban record
      const ban = await banService.createBanRecord({
        walletAddress: '0x9999...',
        ipAddress: '192.168.1.10',
        reason: 'Test ban for appeal',
      });

      // Create an appeal
      const appeal = await banService.submitAppeal({
        banRecordId: ban.id,
        reason: 'Wrong identification',
        evidence: { proof: 'test evidence' },
      });

      // Process the appeal
      await banService.processAppeal(appeal.id, true);

      // Verify ban status was updated
      const updatedBan = await banService.getBanRecord(ban.id);
      expect(updatedBan.status).toBe('LIFTED');
    });
  });
});