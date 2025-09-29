import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { TokenGiftService } from '../services/token-gift.service';
import { TokenGift } from '../entities/token-gift.entity';
import { TokenGiftTransaction } from '../entities/token-gift-transaction.entity';

describe('TokenGiftService', () => {
  let service: TokenGiftService;
  let mockTokenGiftRepo: any;
  let mockTransactionRepo: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockTokenGiftRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
    };

    mockTransactionRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        const config = {
          STELLAR_NETWORK: 'testnet',
          BASE_PAYMASTER_ADDRESS: '0x1234567890123456789012345678901234567890',
          BASE_PAYMASTER_MAX_GAS: '1000000',
        };
        return config[key] || defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenGiftService,
        {
          provide: getRepositoryToken(TokenGift),
          useValue: mockTokenGiftRepo,
        },
        {
          provide: getRepositoryToken(TokenGiftTransaction),
          useValue: mockTransactionRepo,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TokenGiftService>(TokenGiftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTokenGift', () => {
    it('should create a token gift successfully', async () => {
      const createDto = {
        recipientId: 'user-456',
        tokenAddress: '0x1234567890123456789012345678901234567890',
        tokenSymbol: 'USDC',
        amount: '100.00',
        network: 'stellar' as const,
        message: 'Happy birthday!',
      };

      const mockGift = {
        id: 'gift-123',
        senderId: 'user-123',
        ...createDto,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockTransaction = {
        id: 'tx-123',
        giftId: 'gift-123',
        network: 'stellar',
        txHash: 'stellar-tx-hash',
        status: 'confirmed',
        sponsored: false,
        createdAt: new Date(),
      };

      mockTokenGiftRepo.create.mockReturnValue(mockGift);
      mockTokenGiftRepo.save.mockResolvedValue(mockGift);
      mockTransactionRepo.create.mockReturnValue(mockTransaction);
      mockTransactionRepo.save.mockResolvedValue(mockTransaction);

      const result = await service.createTokenGift(createDto, 'user-123');

      expect(result.gift.senderId).toBe('user-123');
      expect(result.gift.recipientId).toBe('user-456');
      expect(result.gift.tokenSymbol).toBe('USDC');
      expect(result.gift.amount).toBe('100.00');
      expect(mockTokenGiftRepo.create).toHaveBeenCalled();
      expect(mockTokenGiftRepo.save).toHaveBeenCalled();
    });

    it('should handle gasless transactions with paymaster', async () => {
      const createDto = {
        recipientId: 'user-456',
        tokenAddress: '0x1234567890123456789012345678901234567890',
        tokenSymbol: 'USDC',
        amount: '100.00',
        network: 'base' as const,
        message: 'Gasless gift!',
      };

      const mockGift = {
        id: 'gift-456',
        senderId: 'user-123',
        ...createDto,
        status: 'completed',
        baseTxHash: 'base-tx-hash',
        paymasterTxHash: 'paymaster-tx-hash',
        sponsored: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockStellarTx = {
        id: 'tx-stellar',
        giftId: 'gift-456',
        network: 'stellar',
        txHash: 'stellar-tx-hash',
        status: 'confirmed',
        sponsored: false,
        createdAt: new Date(),
      };

      const mockBaseTx = {
        id: 'tx-base',
        giftId: 'gift-456',
        network: 'base',
        txHash: 'base-tx-hash',
        status: 'confirmed',
        sponsored: true,
        paymasterAddress: '0x1234567890123456789012345678901234567890',
        createdAt: new Date(),
      };

      mockTokenGiftRepo.create.mockReturnValue(mockGift);
      mockTokenGiftRepo.save.mockResolvedValue(mockGift);
      mockTransactionRepo.create
        .mockReturnValueOnce(mockStellarTx)
        .mockReturnValueOnce(mockBaseTx);
      mockTransactionRepo.save
        .mockResolvedValueOnce(mockStellarTx)
        .mockResolvedValueOnce(mockBaseTx);

      const result = await service.createTokenGift(createDto, 'user-123');

      expect(result.gift.status).toBe('completed');
      expect(result.transactions).toHaveLength(2);
      expect(result.transactions[1].sponsored).toBe(true);
      expect(result.paymasterStatus?.sponsored).toBe(true);
    });
  });

  describe('getTokenGift', () => {
    it('should return token gift with transactions', async () => {
      const mockGift = {
        id: 'gift-123',
        senderId: 'user-123',
        recipientId: 'user-456',
        tokenSymbol: 'USDC',
        amount: '100.00',
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockTransactions = [
        {
          id: 'tx-1',
          giftId: 'gift-123',
          network: 'stellar',
          txHash: 'stellar-tx-hash',
          status: 'confirmed',
          createdAt: new Date(),
        },
      ];

      mockTokenGiftRepo.findOne.mockResolvedValue(mockGift);
      mockTransactionRepo.find.mockResolvedValue(mockTransactions);

      const result = await service.getTokenGift('gift-123');

      expect(result.gift.id).toBe('gift-123');
      expect(result.transactions).toHaveLength(1);
      expect(result.transactions[0].network).toBe('stellar');
    });

    it('should throw NotFoundException for non-existent gift', async () => {
      mockTokenGiftRepo.findOne.mockResolvedValue(null);

      await expect(service.getTokenGift('non-existent')).rejects.toThrow('Token gift not found');
    });
  });

  describe('getUserTokenGifts', () => {
    it('should return user token gifts', async () => {
      const mockGifts = [
        {
          id: 'gift-1',
          senderId: 'user-123',
          recipientId: 'user-456',
          tokenSymbol: 'USDC',
          amount: '100.00',
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'gift-2',
          senderId: 'user-456',
          recipientId: 'user-123',
          tokenSymbol: 'XLM',
          amount: '50.00',
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockTokenGiftRepo.find.mockResolvedValue(mockGifts);

      const result = await service.getUserTokenGifts('user-123', 20);

      expect(result).toHaveLength(2);
      expect(result[0].senderId).toBe('user-123');
      expect(result[1].recipientId).toBe('user-123');
    });
  });

  describe('getGasEstimate', () => {
    it('should return gas estimate for token gift', async () => {
      const dto = {
        recipientId: 'user-456',
        tokenAddress: '0x1234567890123456789012345678901234567890',
        tokenSymbol: 'USDC',
        amount: '100.00',
        network: 'base' as const,
      };

      const result = await service.getGasEstimate(dto);

      expect(result.network).toBe('base');
      expect(result.gasUsed).toBeDefined();
      expect(result.gasPrice).toBeDefined();
      expect(result.totalCost).toBeDefined();
      expect(result.sponsored).toBe(true);
    });
  });

  describe('getPaymasterStatus', () => {
    it('should return paymaster status', async () => {
      const result = await service.getPaymasterStatus('base');

      expect(result.available).toBe(true);
      expect(result.sponsored).toBe(true);
      expect(result.maxGas).toBeDefined();
      expect(result.remainingBalance).toBeDefined();
      expect(result.network).toBe('base');
    });
  });

  describe('getPerformanceMetrics', () => {
    it('should return performance metrics', async () => {
      mockTokenGiftRepo.count
        .mockResolvedValueOnce(100) // total gifts
        .mockResolvedValueOnce(95); // completed gifts

      const result = await service.getPerformanceMetrics();

      expect(result.totalGifts).toBe(100);
      expect(result.completedGifts).toBe(95);
      expect(result.successRate).toBe(0.95);
    });
  });
});
