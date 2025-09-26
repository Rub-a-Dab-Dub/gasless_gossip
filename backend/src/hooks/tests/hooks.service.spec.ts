import { Test, TestingModule } from '@nestjs/testing';
import { HooksService } from '../services/hooks.service';
import { HookRepository } from '../repositories/hook.repository';
import { HooksGateway } from '../gateways/hooks.gateway';
import { StellarService } from '../services/stellar.service';
import { EventType } from '../entities/hook.entity';

describe('HooksService', () => {
  let service: HooksService;
  let repository: jest.Mocked<HookRepository>;
  let gateway: jest.Mocked<HooksGateway>;
  let stellarService: jest.Mocked<StellarService>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByTransactionId: jest.fn(),
      markAsProcessed: jest.fn(),
      findRecent: jest.fn(),
    };

    const mockGateway = {
      broadcastHookCreated: jest.fn(),
      broadcastHookProcessed: jest.fn(),
      getConnectedClientsCount: jest.fn().mockReturnValue(0),
    };

    const mockStellarService = {
      validateTransaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HooksService,
        { provide: HookRepository, useValue: mockRepository },
        { provide: HooksGateway, useValue: mockGateway },
        { provide: StellarService, useValue: mockStellarService },
      ],
    }).compile();

    service = module.get<HooksService>(HooksService);
    repository = module.get(HookRepository);
    gateway = module.get(HooksGateway);
    stellarService = module.get(StellarService);
  });

  describe('createHook', () => {
    it('should create a hook successfully', async () => {
      const createHookDto = {
        eventType: EventType.XP_UPDATE,
        data: { userId: '123', xpAmount: 100 },
        stellarTransactionId: 'tx123',
        stellarAccountId: 'account123',
      };

      const mockHook = {
        id: 'hook123',
        ...createHookDto,
        processed: false,
        createdAt: new Date(),
      };

      repository.findByTransactionId.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockHook as any);

      const result = await service.createHook(createHookDto);

      expect(repository.create).toHaveBeenCalledWith(createHookDto);
      expect(gateway.broadcastHookCreated).toHaveBeenCalledWith(mockHook);
      expect(result.id).toBe('hook123');
    });

    it('should return existing hook for duplicate transaction', async () => {
      const createHookDto = {
        eventType: EventType.XP_UPDATE,
        data: { userId: '123', xpAmount: 100 },
        stellarTransactionId: 'tx123',
        stellarAccountId: 'account123',
      };

      const existingHook = {
        id: 'existing-hook',
        ...createHookDto,
        processed: true,
        createdAt: new Date(),
      };

      repository.findByTransactionId.mockResolvedValue(existingHook as any);

      const result = await service.createHook(createHookDto);

      expect(repository.create).not.toHaveBeenCalled();
      expect(result.id).toBe('existing-hook');
    });
  });

  describe('processStellarEvent', () => {
    it('should process stellar event successfully', async () => {
      const stellarEventDto = {
        transactionId: 'tx123',
        accountId: 'account123',
        eventType: EventType.TOKEN_SEND,
        eventData: { amount: '100', asset: 'XLM' },
      };

      const mockHook = {
        id: 'hook123',
        eventType: EventType.TOKEN_SEND,
        data: stellarEventDto.eventData,
        stellarTransactionId: stellarEventDto.transactionId,
        stellarAccountId: stellarEventDto.accountId,
        processed: false,
        createdAt: new Date(),
      };

      stellarService.validateTransaction.mockResolvedValue(true);
      repository.findByTransactionId.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockHook as any);

      const result = await service.processStellarEvent(stellarEventDto);

      expect(stellarService.validateTransaction).toHaveBeenCalledWith('tx123');
      expect(result.id).toBe('hook123');
    });

    it('should reject invalid stellar transaction', async () => {
      const stellarEventDto = {
        transactionId: 'invalid-tx',
        accountId: 'account123',
        eventType: EventType.TOKEN_SEND,
        eventData: { amount: '100', asset: 'XLM' },
      };

      stellarService.validateTransaction.mockResolvedValue(false);

      await expect(service.processStellarEvent(stellarEventDto))
        .rejects.toThrow('Invalid Stellar transaction: invalid-tx');
    });
  });
});