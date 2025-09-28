import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RateLimitService } from '../services/rate-limit.service';
import { RateLimitViolation } from '../entities/rate-limit-violation.entity';

describe('RateLimitService Performance Tests', () => {
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

  describe('Performance with 200 requests/min', () => {
    it('should handle 200 concurrent violation logs without performance degradation', async () => {
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

      const startTime = Date.now();
      const promises: Promise<any>[] = [];

      // Simulate 200 concurrent violation logs
      for (let i = 0; i < 200; i++) {
        const promise = service.logViolation({
          ...violationData,
          userId: `user-${i}`,
          ipAddress: `192.168.1.${i % 255}`,
          requestCount: 101 + i,
        });
        promises.push(promise);
      }

      const results = await Promise.all(promises);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // All should succeed
      expect(results).toHaveLength(200);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.id).toBe('violation-123');
      });

      // Performance assertions
      expect(totalTime).toBeLessThan(5000); // Should complete in under 5 seconds
      expect(totalTime / 200).toBeLessThan(25); // Average < 25ms per operation

      console.log(`Performance Stats:
        Total Operations: 200
        Total Time: ${totalTime}ms
        Average Time per Operation: ${(totalTime / 200).toFixed(2)}ms
        Operations per Second: ${(200 / (totalTime / 1000)).toFixed(2)}`);
    });

    it('should maintain performance under sustained load', async () => {
      const mockViolation = { id: 'violation-123' };
      mockRepository.create.mockReturnValue(mockViolation);
      mockRepository.save.mockResolvedValue(mockViolation);

      const latencies: number[] = [];
      const iterations = 100;

      // Process 100 violations and measure latency
      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        
        await service.logViolation({
          userId: `user-${i}`,
          ipAddress: `192.168.1.${i % 255}`,
          endpoint: `POST /api/gossip-${i}`,
          violationType: 'short',
          requestCount: 101 + i,
          limit: 100,
        });
        
        const endTime = Date.now();
        latencies.push(endTime - startTime);
      }

      // Calculate statistics
      const averageLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      const maxLatency = Math.max(...latencies);
      const minLatency = Math.min(...latencies);

      // Performance assertions
      expect(averageLatency).toBeLessThan(50); // Average < 50ms
      expect(maxLatency).toBeLessThan(100); // Max < 100ms
      expect(minLatency).toBeLessThan(20); // Min < 20ms

      console.log(`Sustained Load Performance:
        Average Latency: ${averageLatency.toFixed(2)}ms
        Max Latency: ${maxLatency}ms
        Min Latency: ${minLatency}ms
        Total Operations: ${iterations}`);
    });

    it('should handle bulk queries efficiently', async () => {
      const mockViolations = Array.from({ length: 100 }, (_, i) => ({
        id: `violation-${i}`,
        userId: `user-${i}`,
        ipAddress: `192.168.1.${i % 255}`,
        endpoint: `POST /api/gossip-${i}`,
        createdAt: new Date(),
      }));

      mockRepository.find.mockResolvedValue(mockViolations);

      const startTime = Date.now();
      
      // Simulate multiple concurrent queries
      const queries = [
        service.getViolationsByUser('user-123', 50),
        service.getViolationsByIp('192.168.1.1', 50),
        service.getViolationsByEndpoint('POST /api/gossip', 50),
        service.getRecentViolations(24, 100),
      ];

      const results = await Promise.all(queries);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // All queries should succeed
      results.forEach(result => {
        expect(result).toHaveLength(100);
      });

      // Should handle bulk queries efficiently
      expect(totalTime).toBeLessThan(1000); // Under 1 second for 4 concurrent queries
      expect(totalTime / 4).toBeLessThan(250); // Average < 250ms per query

      console.log(`Bulk Query Performance:
        Queries: 4
        Total Time: ${totalTime}ms
        Average Time per Query: ${(totalTime / 4).toFixed(2)}ms`);
    });

    it('should handle statistics queries efficiently', async () => {
      const mockStats = {
        totalViolations: 1000,
        uniqueUsers: 100,
        uniqueIps: 50,
        topEndpoints: [{ endpoint: '/api/gossip', count: 500 }],
        topUsers: [{ userId: 'user-123', count: 50 }],
        topIps: [{ ipAddress: '192.168.1.1', count: 100 }],
      };

      // Mock complex query builder operations
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ count: '100' }),
        getRawMany: jest.fn().mockResolvedValue([
          { endpoint: '/api/gossip', count: '500' },
          { userId: 'user-123', count: '50' },
          { ipAddress: '192.168.1.1', count: '100' },
        ]),
      };

      mockRepository.count.mockResolvedValue(1000);
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const startTime = Date.now();
      const result = await service.getViolationStats(24);
      const endTime = Date.now();
      const queryTime = endTime - startTime;

      expect(result.totalViolations).toBe(1000);
      expect(result.uniqueUsers).toBe(100);
      expect(result.uniqueIps).toBe(100);
      expect(queryTime).toBeLessThan(500); // Should complete in under 500ms

      console.log(`Statistics Query Performance:
        Query Time: ${queryTime}ms
        Total Violations: ${result.totalViolations}
        Unique Users: ${result.uniqueUsers}
        Unique IPs: ${result.uniqueIps}`);
    });

    it('should handle cleanup operations efficiently', async () => {
      const mockResult = { affected: 1000 };
      const mockQueryBuilder = {
        delete: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(mockResult),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const startTime = Date.now();
      const deletedCount = await service.cleanupOldViolations(30);
      const endTime = Date.now();
      const cleanupTime = endTime - startTime;

      expect(deletedCount).toBe(1000);
      expect(cleanupTime).toBeLessThan(2000); // Should complete in under 2 seconds

      console.log(`Cleanup Performance:
        Deleted Records: ${deletedCount}
        Cleanup Time: ${cleanupTime}ms
        Records per Second: ${(deletedCount / (cleanupTime / 1000)).toFixed(2)}`);
    });
  });

  describe('Memory and resource management', () => {
    it('should handle large result sets efficiently', async () => {
      const largeResultSet = Array.from({ length: 1000 }, (_, i) => ({
        id: `violation-${i}`,
        userId: `user-${i % 100}`,
        ipAddress: `192.168.1.${i % 255}`,
        endpoint: `POST /api/gossip-${i}`,
        createdAt: new Date(),
      }));

      mockRepository.find.mockResolvedValue(largeResultSet);

      const startTime = Date.now();
      const result = await service.getRecentViolations(24, 1000);
      const endTime = Date.now();
      const queryTime = endTime - startTime;

      expect(result).toHaveLength(1000);
      expect(queryTime).toBeLessThan(1000); // Should handle 1000 records efficiently

      console.log(`Large Result Set Performance:
        Records: 1000
        Query Time: ${queryTime}ms
        Records per Second: ${(1000 / (queryTime / 1000)).toFixed(2)}`);
    });

    it('should handle concurrent operations without memory leaks', async () => {
      const mockViolation = { id: 'violation-123' };
      mockRepository.create.mockReturnValue(mockViolation);
      mockRepository.save.mockResolvedValue(mockViolation);

      const operations: Promise<any>[] = [];

      // Simulate 50 concurrent operations
      for (let i = 0; i < 50; i++) {
        const operation = service.logViolation({
          userId: `user-${i}`,
          ipAddress: `192.168.1.${i % 255}`,
          endpoint: `POST /api/gossip-${i}`,
          violationType: 'short',
          requestCount: 101 + i,
          limit: 100,
        });
        operations.push(operation);
      }

      const startTime = Date.now();
      const results = await Promise.all(operations);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(results).toHaveLength(50);
      expect(totalTime).toBeLessThan(2000); // Should complete in under 2 seconds

      console.log(`Concurrent Operations Performance:
        Operations: 50
        Total Time: ${totalTime}ms
        Average Time per Operation: ${(totalTime / 50).toFixed(2)}ms`);
    });
  });
});
