import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RateLimitViolation } from '../entities/rate-limit-violation.entity';
import { ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);

  constructor(
    @InjectRepository(RateLimitViolation)
    private readonly violationRepo: Repository<RateLimitViolation>,
  ) {}

  async logViolation(data: {
    userId?: string;
    ipAddress: string;
    endpoint: string;
    violationType: 'short' | 'medium' | 'long' | 'custom';
    requestCount: number;
    limit: number;
    userAgent?: string;
    metadata?: Record<string, any>;
  }): Promise<RateLimitViolation> {
    try {
      const violation = this.violationRepo.create({
        userId: data.userId,
        ipAddress: data.ipAddress,
        endpoint: data.endpoint,
        violationType: data.violationType,
        requestCount: data.requestCount,
        limit: data.limit,
        userAgent: data.userAgent,
        metadata: data.metadata,
        status: 'active',
      });

      const savedViolation = await this.violationRepo.save(violation);

      this.logger.warn(`Rate limit violation logged: ${data.endpoint} by ${data.userId || data.ipAddress} (${data.requestCount}/${data.limit})`);

      return savedViolation;
    } catch (error) {
      this.logger.error('Failed to log rate limit violation:', error);
      throw error;
    }
  }

  async getViolationsByUser(userId: string, limit: number = 50): Promise<RateLimitViolation[]> {
    return this.violationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getViolationsByIp(ipAddress: string, limit: number = 50): Promise<RateLimitViolation[]> {
    return this.violationRepo.find({
      where: { ipAddress },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getViolationsByEndpoint(endpoint: string, limit: number = 50): Promise<RateLimitViolation[]> {
    return this.violationRepo.find({
      where: { endpoint },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getRecentViolations(hours: number = 24, limit: number = 100): Promise<RateLimitViolation[]> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return this.violationRepo.find({
      where: {
        createdAt: { $gte: since } as any,
      },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getViolationStats(hours: number = 24): Promise<{
    totalViolations: number;
    uniqueUsers: number;
    uniqueIps: number;
    topEndpoints: Array<{ endpoint: string; count: number }>;
    topUsers: Array<{ userId: string; count: number }>;
    topIps: Array<{ ipAddress: string; count: number }>;
  }> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const [totalViolations, uniqueUsers, uniqueIps, topEndpoints, topUsers, topIps] = await Promise.all([
      this.violationRepo.count({
        where: { createdAt: { $gte: since } as any },
      }),
      this.violationRepo
        .createQueryBuilder('violation')
        .select('COUNT(DISTINCT violation.userId)', 'count')
        .where('violation.createdAt >= :since', { since })
        .andWhere('violation.userId IS NOT NULL')
        .getRawOne()
        .then(result => parseInt(result.count) || 0),
      this.violationRepo
        .createQueryBuilder('violation')
        .select('COUNT(DISTINCT violation.ipAddress)', 'count')
        .where('violation.createdAt >= :since', { since })
        .getRawOne()
        .then(result => parseInt(result.count) || 0),
      this.violationRepo
        .createQueryBuilder('violation')
        .select('violation.endpoint', 'endpoint')
        .addSelect('COUNT(*)', 'count')
        .where('violation.createdAt >= :since', { since })
        .groupBy('violation.endpoint')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany(),
      this.violationRepo
        .createQueryBuilder('violation')
        .select('violation.userId', 'userId')
        .addSelect('COUNT(*)', 'count')
        .where('violation.createdAt >= :since', { since })
        .andWhere('violation.userId IS NOT NULL')
        .groupBy('violation.userId')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany(),
      this.violationRepo
        .createQueryBuilder('violation')
        .select('violation.ipAddress', 'ipAddress')
        .addSelect('COUNT(*)', 'count')
        .where('violation.createdAt >= :since', { since })
        .groupBy('violation.ipAddress')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany(),
    ]);

    return {
      totalViolations,
      uniqueUsers,
      uniqueIps,
      topEndpoints: topEndpoints.map(item => ({
        endpoint: item.endpoint,
        count: parseInt(item.count),
      })),
      topUsers: topUsers.map(item => ({
        userId: item.userId,
        count: parseInt(item.count),
      })),
      topIps: topIps.map(item => ({
        ipAddress: item.ipAddress,
        count: parseInt(item.count),
      })),
    };
  }

  async resolveViolation(violationId: string): Promise<void> {
    await this.violationRepo.update(violationId, { status: 'resolved' });
    this.logger.log(`Rate limit violation ${violationId} resolved`);
  }

  async ignoreViolation(violationId: string): Promise<void> {
    await this.violationRepo.update(violationId, { status: 'ignored' });
    this.logger.log(`Rate limit violation ${violationId} ignored`);
  }

  async cleanupOldViolations(days: number = 30): Promise<number> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const result = await this.violationRepo
      .createQueryBuilder()
      .delete()
      .where('createdAt < :cutoffDate', { cutoffDate })
      .execute();

    this.logger.log(`Cleaned up ${result.affected} old rate limit violations`);
    return result.affected || 0;
  }

  // Performance monitoring
  async getPerformanceMetrics(): Promise<{
    averageResponseTime: number;
    violationsPerMinute: number;
    successRate: number;
    topViolatingEndpoints: string[];
  }> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const [recentViolations, totalViolations] = await Promise.all([
      this.violationRepo.count({
        where: { createdAt: { $gte: oneHourAgo } as any },
      }),
      this.violationRepo.count(),
    ]);

    const violationsPerMinute = recentViolations / 60;
    const successRate = totalViolations > 0 ? (totalViolations - recentViolations) / totalViolations : 1;

    return {
      averageResponseTime: 0, // Would be tracked in real implementation
      violationsPerMinute,
      successRate,
      topViolatingEndpoints: [], // Would be calculated from recent data
    };
  }
}
