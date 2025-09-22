import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { MemecoinsService } from '../services/memecoins.service';
import { StellarService } from '../services/stellar.service';
import { MemecoinDrop } from '../entities/memecoin-drop.entity';

describe('MemecoinsService', () => {
  let service: MemecoinsService;
  let repository: Repository<MemecoinDrop>;
  let stellarService: StellarService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  const mockStellarService = {
    distributeToRecipients: jest.fn(),
    getIssuerPublicKey: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemecoinsService,
        {
          provide: getRepositoryToken(MemecoinDrop),
          useValue: mockRepository,
        },
        {
          provide: StellarService,
          useValue: mockStellarService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<MemecoinsService>(MemecoinsService);
    repository = module.get<Repository<MemecoinDrop>>(getRepositoryToken(MemecoinDrop));
    stellarService = module.get<StellarService>(StellarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDrop', () => {
    it('should create a successful drop', async () => {
      const createDropDto = {
        recipients: ['GCKFBEIYTKP633RJWBRR6F4ZCACDQY7CXMOJSM47MXXRX5QVYLZQ7JGD'],
        amount: 100,
        assetCode: 'MEME',
        dropType: 'reward' as const,
      };

      const mockDrop = {
        id: 'test-id',
        ...createDropDto,
        status: 'pending',
        txId: null,
      };

      const mockCompletedDrop = {
        ...mockDrop,
        status: 'completed',
        txId: 'test-tx-id',
      };

      mockRepository.create.mockReturnValue(mockDrop);
      mockRepository.save.mockResolvedValueOnce(mockDrop);
      mockStellarService.getIssuerPublicKey.mockReturnValue('test-issuer');
      mockStellarService.distributeToRecipients.mockResolvedValue('test-tx-id');
      mockRepository.save.mockResolvedValueOnce(mockCompletedDrop);

      const result = await service.createDrop(createDropDto);

      expect(result.status).toBe('completed');
      expect(result.txId).toBe('test-tx-id');
      expect(mockStellarService.distributeToRecipients).toHaveBeenCalledWith(
        createDropDto.recipients,
        createDropDto.amount,
        createDropDto.assetCode,
      );
    });

    it('should handle distribution failure', async () => {
      const createDropDto = {
        recipients: ['INVALID_ADDRESS'],
        amount: 100,
        assetCode: 'MEME',
        dropType: 'reward' as const,
      };

      const mockDrop = {
        id: 'test-id',
        ...createDropDto,
        status: 'pending',
        txId: null,
      };

      mockRepository.create.mockReturnValue(mockDrop);
      mockRepository.save.mockResolvedValueOnce(mockDrop);
      mockStellarService.getIssuerPublicKey.mockReturnValue('test-issuer');
      mockStellarService.distributeToRecipients.mockRejectedValue(
        new Error('Distribution failed'),
      );

      await expect(service.createDrop(createDropDto)).rejects.toThrow('Distribution failed');
    });
  });

  describe('getUserDrops', () => {
    it('should return user drops with pagination', async () => {
      const mockDrops = [
        { id: '1', recipients: ['user1'], amount: 100 },
        { id: '2', recipients: ['user1'], amount: 50 },
      ];

      mockRepository.findAndCount.mockResolvedValue([mockDrops, 2]);

      const result = await service.getUserDrops('user1', 1, 10);

      expect(result.drops).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });
  });
});
