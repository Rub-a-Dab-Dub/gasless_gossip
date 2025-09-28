import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RateLimitService } from '../services/rate-limit.service';
import { RateLimitViolation } from '../entities/rate-limit-violation.entity';

describe('RateLimitService', () => {
  let service: RateLimitService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimitService,
        {
          provide: getRepositoryToken(RateLimitViolation),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RateLimitService>(RateLimitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logViolation', () => {
    it('should log a rate limit violation', async () => {
      const violationData = {
        userId: 'user-123',
        ipAddress: '192.168.1.1',
        endpoint: 'POST /api/gossip',
        violationType: 'short' as const,
        requestCount: 101,
        limit: 100,
        userAgent: 'Mozilla/5.0',
        metadata: { method: 'POST' },
      };

      const mockViolation = { id: 'violation-123', ...violationData };
      mockRepository.create.mockReturnValue(mockViolation);
      mockRepository.save.mockResolvedValue(mockViolation);

      const result = await service.logViolation(violationData);

      expect(result).toEqual(mockViolation);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...violationData,
        status: 'active',
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockViolation);
    });
  });

  describe('getViolationsByUser', () => {
    it('should return violations for a specific user', async () => {
      const mockViolations = [
        { id: 'violation-1', userId: 'user-123' },
        { id: 'violation-2', userId: 'user-123' },
      ];

      mockRepository.find.mockResolvedValue(mockViolations);

      const result = await service.getViolationsByUser('user-123', 50);

      expect(result).toEqual(mockViolations);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        order: { createdAt: 'DESC' },
        take: 50,
      });
    });
  });

  describe('getViolationStats', () => {
    it('should return violation statistics', async () => {
      const mockStats = {
        totalViolations: 100,
        uniqueUsers: 25,
        uniqueIps: 15,
        topEndpoints: [{ endpoint: '/api/gossip', count: 50 }],
        topUsers: [{ userId: 'user-123', count: 10 }],
        topIps: [{ ipAddress: '192.168.1.1', count: 20 }],
      };

      // Mock the query builder methods
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ count: '25' }),
        getRawMany: jest.fn().mockResolvedValue([
          { endpoint: '/api/gossip', count: '50' },
        ]),
      };

      mockRepository.count.mockResolvedValue(100);
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getViolationStats(24);

      expect(result.totalViolations).toBe(100);
      expect(result.uniqueUsers).toBe(25);
      expect(result.uniqueIps).toBe(25);
    });
  });

  describe('cleanupOldViolations', () => {
    it('should clean up old violations', async () => {
      const mockResult = { affected: 50 };
      const mockQueryBuilder = {
        delete: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(mockResult),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.cleanupOldViolations(30);

      expect(result).toBe(50);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
