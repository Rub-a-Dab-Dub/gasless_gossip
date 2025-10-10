import { Test, TestingModule } from '@nestjs/testing';
import { PatternDetectionService } from '../pattern-detection.service';
import { IpLog } from '../entities/ip-log.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BanRecord } from '../entities/ban-record.entity';
import { EvasionEvidence } from '../entities/evasion-evidence.entity';

describe('PatternDetectionService', () => {
  let service: PatternDetectionService;
  let ipLogRepo: Repository<IpLog>;
  let banRecordRepo: Repository<BanRecord>;
  let evidenceRepo: Repository<EvasionEvidence>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatternDetectionService,
        {
          provide: getRepositoryToken(IpLog),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            }),
          },
        },
        {
          provide: getRepositoryToken(BanRecord),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: getRepositoryToken(EvasionEvidence),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PatternDetectionService>(PatternDetectionService);
    ipLogRepo = module.get<Repository<IpLog>>(getRepositoryToken(IpLog));
    banRecordRepo = module.get<Repository<BanRecord>>(getRepositoryToken(BanRecord));
    evidenceRepo = module.get<Repository<EvasionEvidence>>(getRepositoryToken(EvasionEvidence));
  });

  it('should detect patterns with multiple wallets from same IP', async () => {
    const mockLogs = [
      {
        ipHash: 'hash1',
        walletAddress: 'wallet1',
        action: 'LOGIN',
        timestamp: new Date(),
      },
      {
        ipHash: 'hash1',
        walletAddress: 'wallet2',
        action: 'LOGIN',
        timestamp: new Date(),
      },
    ];

    const mockBannedWallet = {
      id: '1',
      walletAddress: 'wallet1',
      status: 'ACTIVE',
    };

    jest.spyOn(ipLogRepo, 'createQueryBuilder').mockReturnValue({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockLogs),
    } as any);

    jest.spyOn(banRecordRepo, 'find').mockResolvedValue([mockBannedWallet] as BanRecord[]);

    const results = await service.detectPatterns(24);

    expect(results.length).toBe(1);
    expect(results[0].walletAddress).toBe('wallet1');
    expect(results[0].ipHash).toBe('hash1');
    expect(results[0].confidence).toBeGreaterThan(0);
    expect(results[0].evidence.length).toBeGreaterThan(0);
  });

  it('should not detect patterns with single wallet per IP', async () => {
    const mockLogs = [
      {
        ipHash: 'hash1',
        walletAddress: 'wallet1',
        action: 'LOGIN',
        timestamp: new Date(),
      },
    ];

    jest.spyOn(ipLogRepo, 'createQueryBuilder').mockReturnValue({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockLogs),
    } as any);

    const results = await service.detectPatterns(24);

    expect(results.length).toBe(0);
  });

  it('should calculate confidence scores correctly', async () => {
    const mockLogs = [
      {
        ipHash: 'hash1',
        walletAddress: 'wallet1',
        action: 'LOGIN',
        timestamp: new Date(),
      },
      {
        ipHash: 'hash1',
        walletAddress: 'wallet2',
        action: 'LOGIN',
        timestamp: new Date(),
      },
      {
        ipHash: 'hash1',
        walletAddress: 'wallet1',
        action: 'TRANSACTION',
        timestamp: new Date(),
      },
      {
        ipHash: 'hash1',
        walletAddress: 'wallet2',
        action: 'TRANSACTION',
        timestamp: new Date(),
      },
    ];

    const mockBannedWallet = {
      id: '1',
      walletAddress: 'wallet1',
      status: 'ACTIVE',
    };

    jest.spyOn(ipLogRepo, 'createQueryBuilder').mockReturnValue({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockLogs),
    } as any);

    jest.spyOn(banRecordRepo, 'find').mockResolvedValue([mockBannedWallet] as BanRecord[]);

    const results = await service.detectPatterns(24);

    expect(results.length).toBe(1);
    expect(results[0].confidence).toBeGreaterThan(0.8); // High confidence due to matching patterns
  });
});